import { notNoneVal } from './Common'

export const Line = () => {

  return null
}

Line.displayName = 'DuxSvgLine'

Line.bbox = ({ x1, y1, x2, y2 }) => {
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1
  }
}

Line.draw = (ctx, { x1, y1, x2, y2, stroke }) => {
  ctx.beginPath()

  if (notNoneVal(stroke)) {
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.closePath()
}
