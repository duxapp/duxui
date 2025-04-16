import { isValidElement } from 'react'
import { createOffCanvas, draw } from './Common'

export const ClipPath = () => {

  return null
}

ClipPath.displayName = 'DuxSvgClipPath'

ClipPath.draw = (ctx, { children }, context) => {

  const mask = createOffCanvas(context.layout.width, context.layout.height)

  return {
    instance: {
      draw: content => {
        if (isValidElement(children)) {
          mask.ctx.globalCompositeOperation = 'xor'
          draw({ ...context, ctx: mask.ctx }, children)
          content.ctx.globalCompositeOperation = 'destination-in'
          content.ctx.drawImage(mask.canvas, 0, 0)
        }
      }
    }
  }
}
