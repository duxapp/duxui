import PathSvg from './util/svg-path-to-canvas'

export const Path = () => {
  return null
}

Path.drawBefore = props => {
  return {
    pathSvg: new PathSvg(props.d)
  }
}

Path.bbox = (_props, _context, { pathSvg }) => {

  const [x1, y1, x2, y2] = pathSvg.bounds

  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1
  }
}

Path.draw = (ctx, { beforeData, fill, stroke, strokeWidth = 1 }) => {

  if (fill) {
    ctx.fillStyle = fill
    beforeData.pathSvg.save().beginPath().to(ctx).fill()
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    beforeData.pathSvg.save().beginPath().to(ctx).stroke()
  }
}
