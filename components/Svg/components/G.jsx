import { Children, cloneElement, isValidElement } from 'react'
import { draw, margeProps, pure } from './Common'

export const G = /*@__PURE__*/ pure(() => {
  const G_ = () => {

    return null
  }

  G_.displayName = 'DuxSvgG'

  G_.bbox = ({ children, ...props }, context) => {
    const bboxs = []
    Children.forEach(children, child => {
      if (isValidElement(child)) {
        const beforeData = child.type.drawBefore?.(child.props, context)
        const bbox = child.type.bbox?.({ ...props, ...child.props }, context, beforeData)
        if (bbox) {
          bboxs.push(bbox)
        }
      }
    })

    if (!bboxs.length) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
    }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    // 遍历所有 bbox
    bboxs.forEach(({ x, y, width, height }) => {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x + width)
      maxY = Math.max(maxY, y + height)
    })

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  G_.drawBefore = ({ x = 0, y = 0 }, { ctx }) => {
    ctx.save()
    ctx.translate(x, y)
  }

  G_.draw = (ctx, { children, x, y, ...props }, context) => {
    const res = draw(context, Children.map(children, child => {
      if (isValidElement(child)) {
        return cloneElement(child, margeProps(child.props, props))
      }
      return child
    }))
    ctx.restore()
    return res
  }

  return G_
})
