export const Line = () => {

  return null
}

Line.draw = (ctx, { x1, y1, x2, y2, stroke, strokeWidth = 1 }) => {
  ctx.beginPath()

  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.closePath()
}
