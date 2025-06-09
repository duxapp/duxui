import { notNoneVal, pure } from './Common'

export const Polygon = /*@__PURE__*/ pure(() => {
  const Polygon_ = () => {

    return null
  }

  Polygon_.displayName = 'DuxSvgPolygon'

  Polygon_.drawBefore = props => {
    return {
      points: props.points?.split(' ').map(item => item.split(','))
    }
  }

  Polygon_.bbox = (props, context, { points }) => bbox(points)

  Polygon_.range = reage

  Polygon_.draw = (ctx, { beforeData, fill, stroke }) => {
    ctx.beginPath()
    draw(ctx, beforeData.points, true)
    if (notNoneVal(fill)) {
      ctx.fill()
    }
    if (notNoneVal(stroke)) {
      ctx.stroke()
    }
    ctx.closePath()
  }

  return Polygon_
})

export const Polyline = /*@__PURE__*/ pure(() => {
  const Polyline_ = () => {

    return null
  }

  Polyline_.displayName = 'DuxSvgPolyline'

  Polyline_.drawBefore = props => {
    return {
      points: props.points?.split(' ').map(item => item.split(','))
    }
  }

  Polyline_.bbox = (props, context, { points }) => bbox(points)

  Polyline_.range = reage

  Polyline_.draw = (ctx, { beforeData, fill, stroke }) => {
    ctx.beginPath()
    draw(ctx, beforeData.points)
    if (notNoneVal(fill)) {
      ctx.fill()
    }
    if (notNoneVal(stroke)) {
      ctx.stroke()
    }
    ctx.closePath()
  }

  return Polyline_
})

const draw = (ctx, points = '', gon) => {
  points.forEach((item, index) => {
    ctx[index ? 'lineTo' : 'moveTo'](+item[0], +item[1])
    if (gon && index === points.length - 1) {
      ctx.lineTo(+points[0][0], +points[0][1])
    }
  })
}

const bbox = points => {

  const xCoords = points.map(point => point[0])
  const yCoords = points.map(point => point[1])

  const xMin = Math.min(...xCoords)
  const yMin = Math.min(...yCoords)
  const xMax = Math.max(...xCoords)
  const yMax = Math.max(...yCoords)

  return {
    x: xMin,
    y: yMin,
    width: xMax - xMin,
    height: yMax - yMin
  }
}

function reage(touch, { points }) {
  points = points?.split(' ').map(item => item.split(',').map(v => +v))

  const { x, y } = touch
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i]
    const [xj, yj] = points[j]

    // 判断射线是否穿过多边形边
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }

  return inside
}
