import { Children, isValidElement } from 'react'
import { parseOriginPercentage, pure, stopOpacityColor } from './Common'

export const RadialGradient = /*@__PURE__*/ pure(() => {
  const RadialGradient_ = () => {

    return null
  }

  RadialGradient_.displayName = 'DuxSvgRadialGradient'

  RadialGradient_.draw = (ctx, { cx, cy, rx, ry, fx, fy, children }) => {
    const r = Math.max(rx, ry)

    const gradient = ctx.createRadialGradient(fx, fy, 0, cx, cy, r)

    Children.forEach(children, (child => {
      if (isValidElement(child) && child.type.displayName === 'DuxSvgStop') {
        const { offset, stopColor, stopOpacity } = child.props

        gradient.addColorStop(parseOriginPercentage(offset), stopOpacityColor(stopColor, +stopOpacity))
      }
    }))

    return {
      instance: gradient
    }
  }

  return RadialGradient_
})
