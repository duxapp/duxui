
import parse from './parse-svg-path'
import abs from './abs-svg-path'
import normalize from './normalize-svg-path'
import isSvgPath from './is-svg-path'

export default function pathBounds(path) {
  // ES6 string tpl call
  if (Array.isArray(path) && path.length === 1 && typeof path[0] === 'string') path = path[0]

  // svg path string
  if (typeof path === 'string') {
    if (!isSvgPath(path)) throw Error('String is not an SVG path.')
    path = parse(path)
  }

  if (!Array.isArray(path)) throw Error('Argument should be a string or an array of path segments.')

  path = abs(path)
  path = normalize(path)

  if (!path.length) return [0, 0, 0, 0]

  var bounds = [Infinity, Infinity, -Infinity, -Infinity]

  for (var i = 0, l = path.length; i < l; i++) {
    var points = path[i].slice(1)

    for (var j = 0; j < points.length; j += 2) {
      if (points[j + 0] < bounds[0]) bounds[0] = points[j + 0]
      if (points[j + 1] < bounds[1]) bounds[1] = points[j + 1]
      if (points[j + 0] > bounds[2]) bounds[2] = points[j + 0]
      if (points[j + 1] > bounds[3]) bounds[3] = points[j + 1]
    }
  }

  return bounds
}
