import parse from './parse-svg-path'
import abs from './abs-svg-path'
import normalize from './normalize-svg-path'
import isSvgPath from './is-svg-path'

const _initialPath = Symbol('initialPath')
const _path = Symbol('path')
const _bounds = Symbol('bounds')
const _savedPaths = Symbol('savedPaths')
const _renderProps = Symbol('renderProps')
const _beginPath = Symbol('beginPath')

export default class SvgPath {
  constructor(d) {
    if (!isSvgPath(d)) {
      throw new Error('Not an SVG path!')
    }

    this[_initialPath] = abs(parse(d))
    this[_path] = normalize(this[_initialPath])
    this[_bounds] = null
    this[_savedPaths] = []
    this[_renderProps] = {}
    this[_beginPath] = false
  }

  save() {
    this[_savedPaths].push({
      path: this[_path],
      bounds: this[_bounds],
      renderProps: Object.assign({}, this[_renderProps])
    })
    return this
  }

  restore() {
    if (this[_savedPaths].length) {
      const { path, bounds, renderProps } = this[_savedPaths].pop()
      this[_path] = path
      this[_bounds] = bounds
      this[_renderProps] = renderProps
    }
    return this
  }

  get bounds() {
    if (!this[_bounds]) {
      const path = this[_path]
      this[_bounds] = [0, 0, 0, 0]
      if (path.length) {
        const bounds = [Infinity, Infinity, -Infinity, -Infinity]

        for (let i = 0, l = path.length; i < l; i++) {
          const points = path[i].slice(1)

          for (let j = 0; j < points.length; j += 2) {
            if (points[j + 0] < bounds[0]) bounds[0] = points[j + 0]
            if (points[j + 1] < bounds[1]) bounds[1] = points[j + 1]
            if (points[j + 0] > bounds[2]) bounds[2] = points[j + 0]
            if (points[j + 1] > bounds[3]) bounds[3] = points[j + 1]
          }
        }
        this[_bounds] = bounds
      }
    }
    return this[_bounds]
  }

  get size() {
    const bounds = this.bounds
    return [bounds[2] - bounds[0], bounds[3] - bounds[1]]
  }

  get center() {
    const [x0, y0, x1, y1] = this.bounds
    return [(x0 + x1) / 2, (y0 + y1) / 2]
  }

  get d() {
    let path = this[_path].map((p) => {
      const [c, ...points] = p
      return c + points.join()
    }).join('')
    if (this.isClosed) {
      path += 'Z'
    }
    return path
  }

  get path() {
    return this[_path]
  }

  get isClosed() {
    const part = this[_initialPath][this[_initialPath].length - 1]
    return part && part[0] === 'Z'
  }

  trim() {
    const [x, y] = this.bounds
    this.translate(-x, -y)
    return this
  }

  beginPath() {
    this[_beginPath] = true
    return this
  }

  to(context) {
    const commands = this[_path]
    const renderProps = this[_renderProps]
    if (commands.length) {
      if (this[_beginPath]) {
        context.beginPath()
      }
      commands.forEach((c) => {
        const [cmd, ...args] = c
        if (cmd === 'M') {
          context.moveTo(...args)
        } else {
          context.bezierCurveTo(...args)
        }
      })
      if (this.isClosed) {
        context.closePath()
      }
    }
    Object.assign(context, renderProps)
    return {
      stroke() {
        context.stroke()
        return this
      },
      fill() {
        context.fill()
        return this
      },
    }
  }

  strokeStyle(value) {
    this[_renderProps].strokeStyle = value
    return this
  }

  fillStyle(value) {
    this[_renderProps].fillStyle = value
    return this
  }

  lineWidth(value) {
    this[_renderProps].lineWidth = value
    return this
  }

  lineCap(value) {
    this[_renderProps].lineCap = value
    return this
  }

  lineJoin(value) {
    this[_renderProps].lineJoin = value
    return this
  }
}
