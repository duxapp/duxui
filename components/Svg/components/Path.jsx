import PathSvg from './util/svg-path-to-canvas'
import { notNoneVal } from './Common'

export const Path = () => {
  return null
}

Path.displayName = 'DuxSvgPath'

Path.drawBefore = props => {
  return {
    pathSvg: new PathSvg(props.d)
  }
}

Path.range = (touch, props, context) => {
  new PathSvg(props.d).to(context.ctx)
  const matrix = context.ctx.getTransform()
  return context.ctx.isPointInPath(touch.x * matrix.a, touch.y * matrix.d)
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

Path.draw = (ctx, { beforeData, fill, stroke }) => {

  beforeData.pathSvg.to(ctx)

  if (notNoneVal(fill)) {
    ctx.fill()
  }
  if (notNoneVal(stroke)) {
    ctx.stroke()
  }
}
