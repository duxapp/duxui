import PathSvg from './util/svg-path-to-canvas'
import { notNoneVal, pure } from './Common'

export const Path = /*@__PURE__*/ pure(() => {
  const Path_ = () => {
    return null
  }

  Path_.displayName = 'DuxSvgPath'

  Path_.drawBefore = props => {
    return {
      pathSvg: new PathSvg(props.d)
    }
  }

  Path_.range = (touch, props, context) => {
    new PathSvg(props.d).to(context.ctx)
    const matrix = context.ctx.getTransform()
    return context.ctx.isPointInPath(touch.x * matrix.a, touch.y * matrix.d)
  }

  Path_.bbox = (_props, _context, { pathSvg }) => {

    const [x1, y1, x2, y2] = pathSvg.bounds

    return {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1
    }
  }

  Path_.draw = (ctx, { beforeData, fill, stroke }) => {

    beforeData.pathSvg.to(ctx)

    if (notNoneVal(fill)) {
      ctx.fill()
    }
    if (notNoneVal(stroke)) {
      ctx.stroke()
    }
  }

  return Path_
})
