import { Children, cloneElement, isValidElement } from 'react'
import { draw, margeProps, pure } from './Common'

export const Defs = /*@__PURE__*/ pure(() => {
  const Defs_ = () => {

    return null
  }

  Defs_.displayName = 'DuxSvgDefs'

  Defs_.draw = (ctx, { children }, context) => {
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

  return Defs_
})
