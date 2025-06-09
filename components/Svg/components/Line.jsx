import { notNoneVal, pure } from './Common'

export const Line = /*@__PURE__*/ pure(() => {
  const Line_ = () => {

    return null
  }

  Line_.displayName = 'DuxSvgLine'

  Line_.bbox = ({ x1, y1, x2, y2 }) => {
    return {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1
    }
  }

  Line_.draw = (ctx, { x1, y1, x2, y2, stroke }) => {
    ctx.beginPath()

    if (notNoneVal(stroke)) {
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    ctx.closePath()
  }

  return Line_
})
