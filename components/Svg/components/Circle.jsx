import { notNoneVal, pure } from './Common'

export const Circle = /*@__PURE__*/ pure(() => {
  const Circle_ = () => {
    return null
  }
  Circle_.displayName = 'DuxSvgCircle'

  Circle_.bbox = ({ cx, cy, r }) => {
    return {
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2
    }
  }

  Circle_.range = (touch, { cx, cy, r }) => {
    const dx = touch.x - cx
    const dy = touch.y - cy
    return dx * dx + dy * dy <= r * r
  }

  Circle_.draw = (ctx, { cx, cy, r, fill, stroke }) => {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    if (notNoneVal(fill)) {
      ctx.fill()
    }
    if (notNoneVal(stroke)) {
      ctx.stroke()
    }
    ctx.closePath()
  }
  return Circle_
})
