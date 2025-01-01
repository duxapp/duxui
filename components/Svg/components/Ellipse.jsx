import { notNoneVal } from './Common'

export const Ellipse = () => {

  return null
}

Ellipse.displayName = 'DuxSvgEllipse'

Ellipse.bbox = ({ cx, cy, rx, ry }) => {
  return {
    x: cx - rx,
    y: cy - ry,
    width: rx * 2,
    height: ry * 2
  }
}

Ellipse.range = (touch, { cx, cy, rx, ry }) => {
  const dx = touch.x - cx
  const dy = touch.y - cy
  return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1
}

Ellipse.draw = (ctx, { cx, cy, rx, ry, fill, stroke }) => {
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
