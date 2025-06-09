import { isValidElement } from 'react'
import { createOffCanvas, draw, pure } from './Common'

export const ClipPath = /*@__PURE__*/ pure(() => {
  const ClipPath_ = () => {

    return null
  }

  ClipPath_.displayName = 'DuxSvgClipPath'

  ClipPath_.draw = (ctx, { children }, context) => {

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

  return ClipPath_
})
