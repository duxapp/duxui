import parse from './parse-svg-path'
import abs from './abs-svg-path'
import normalize from './normalize-svg-path'
import isSvgPath from './is-svg-path'

const _initialPath = Symbol('initialPath')
const _path = Symbol('path')
const _bounds = Symbol('bounds')

export default class SvgPath {
  constructor(d) {
    if (!isSvgPath(d)) {
      throw new Error('Not an SVG path!')
    }

    this[_initialPath] = abs(parse(d))
    this[_path] = normalize(this[_initialPath])
    this[_bounds] = null
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

  get isClosed() {
    const part = this[_initialPath][this[_initialPath].length - 1]
    return part && part[0] === 'Z'
  }

  to(context) {
    const commands = this[_path]
    if (commands.length) {
      context.beginPath?.()
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
  }
}
