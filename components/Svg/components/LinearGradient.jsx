import { Children, isValidElement } from 'react'
import { Stop } from './Stop'

export const LinearGradient = () => {

  return null
}

LinearGradient.draw = (ctx, { x1, y1, x2, y2, children }, context, box) => {
  const gradient = ctx.createLinearGradient(
    box.x + x1 * box.width,
    box.y + y1 * box.height,
    box.x + x2 * box.width,
    box.y + y2 * box.height,
  )

  Children.forEach(children, (child => {
    if (isValidElement(child) && child.type === Stop) {
      const { offset, stopColor, stopOpacity } = child.props
      gradient.addColorStop(offset, stopColor)
    }
  }))

  return gradient
}
