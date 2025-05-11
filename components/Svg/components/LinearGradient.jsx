import { Children, isValidElement } from 'react'
import { parseOriginPercentage, stopOpacityColor } from './Common'

export const LinearGradient = () => {

  return null
}

LinearGradient.displayName = 'DuxSvgLinearGradient'

LinearGradient.draw = (ctx, { x1, y1, x2, y2, children }, context, { bbox }) => {
  const gradient = ctx.createLinearGradient(
    bbox.x + x1 * bbox.width,
    bbox.y + y1 * bbox.height,
    bbox.x + x2 * bbox.width,
    bbox.y + y2 * bbox.height,
  )

  Children.forEach(children, (child => {
    if (isValidElement(child) && child.type.displayName === 'DuxSvgStop') {
      const { offset, stopColor, stopOpacity } = child.props
      gradient.addColorStop(parseOriginPercentage(offset), stopOpacityColor(stopColor, stopOpacity))
    }
  }))

  return {
    instance: gradient
  }
}
