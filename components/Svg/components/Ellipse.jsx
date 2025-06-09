import { notNoneVal, pure } from './Common'

export const Ellipse = /*@__PURE__*/ pure(() => {
  const Ellipse_ = () => {

    return null
  }

  Ellipse_.displayName = 'DuxSvgEllipse'

  Ellipse_.bbox = ({ cx, cy, rx, ry }) => {
    return {
      x: cx - rx,
      y: cy - ry,
      width: rx * 2,
      height: ry * 2
    }
  }

  Ellipse_.range = (touch, { cx, cy, rx, ry }) => {
    const dx = touch.x - cx
    const dy = touch.y - cy
    return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1
  }

  Ellipse_.draw = (ctx, { cx, cy, rx, ry, fill, stroke }) => {
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI)
    if (notNoneVal(fill)) {
      ctx.fill()
    }
    if (notNoneVal(stroke)) {
      ctx.stroke()
    }
    ctx.closePath()
  }

  return Ellipse_
})
