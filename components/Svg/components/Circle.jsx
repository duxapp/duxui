export const Circle = () => {

  return null
}

Circle.bbox = ({ cx, cy, r }) => {
  return {
    x: cx - r,
    y: cy - r,
    width: cx + r,
    height: cy + r
  }
}

Circle.draw = (ctx, { cx, cy, r, fill, stroke, strokeWidth = 1 }) => {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, 2 * Math.PI)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
  ctx.closePath()
}
