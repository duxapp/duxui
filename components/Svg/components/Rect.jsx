export const Rect = () => {
  return null
}

Rect.bbox = ({ x, y, width, height }) => {
  return {
    x,
    y,
    width,
    height
  }
}

Rect.draw = (ctx, { x, y, width, height, fill, stroke, strokeWidth = 1 }) => {
  if (fill) {
    ctx.fillStyle = fill
    ctx.fillRect(x, y, width, height)
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.strokeRect(x, y, width, height)
  }
}
