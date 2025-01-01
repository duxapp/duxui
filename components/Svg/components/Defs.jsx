import { Children, cloneElement, isValidElement } from 'react'
import { draw, margeProps } from './Common'

export const Defs = () => {

  return null
}

Defs.displayName = 'DuxSvgDefs'

Defs.draw = (ctx, { children }, context) => {
  Children.forEach(children, child => {
    if (isValidElement(child) && child.props.id) {
      context.defs[child.props.id] = ({ props, ...option }) => {
        return draw(
          context,
          props ? cloneElement(child, margeProps(child.props, props)) : child,
          option
        )
      }
    }
  })
}
