import { Children, isValidElement } from 'react'
import { stopOpacityColor } from './Common'

export const RadialGradient = () => {

  return null
}

RadialGradient.displayName = 'DuxSvgRadialGradient'

RadialGradient.draw = (ctx, { cx, cy, rx, ry, fx, fy, children }) => {
  const r = Math.max(rx, ry)

  const gradient = ctx.createRadialGradient(fx, fy, 0, cx, cy, r)

  Children.forEach(children, (child => {
    if (isValidElement(child) && child.type.displayName === 'DuxSvgStop') {
      const { offset, stopColor, stopOpacity } = child.props
      gradient.addColorStop(offset, stopOpacityColor(stopColor, stopOpacity))
    }
  }))

  return {
    instance: gradient
  }
}
