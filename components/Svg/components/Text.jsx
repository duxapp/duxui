export const Text = () => {
  return null
}

Text.drawBefore = ({
  fontSize = 10, fontWeight = 'normal',
  fontFamily = 'sans-serif', textAnchor = 'start',
  fontStyle = 'normal',
}, { ctx }) => {
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

  ctx.textAlign = textAnchor === 'start' ? 'left' : textAnchor === 'middle' ? 'center' : 'right'
}

Text.bbox = ({ x, y, children }, { ctx }) => {

  const metrics = ctx.measureText(children)

  return {
    x: x - metrics.actualBoundingBoxLeft,
    y: y - metrics.actualBoundingBoxAscent,
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  }
}

Text.draw = (ctx, {
  x, y, children,
  fill, stroke, strokeWidth = 1
}) => {


  if (fill) {
    ctx.fillStyle = fill
    ctx.fillText(children, x, y)
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.strokeText(children, x, y)
  }
}
