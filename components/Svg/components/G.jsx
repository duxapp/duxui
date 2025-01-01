import { Children, cloneElement, isValidElement } from 'react'
import { draw, margeProps } from './Common'

export const G = () => {

  return null
}

G.displayName = 'DuxSvgG'

G.bbox = ({ children, ...props }, context) => {
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

G.draw = (ctx, { children, ...props }, context) => {
  return draw(context, Children.map(children, child => {
    if (isValidElement(child)) {
      return cloneElement(child, margeProps(child.props, props))
    }
    return child
  }))
}
