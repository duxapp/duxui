import { Children, isValidElement } from 'react'

export const Defs = () => {

  return null
}

Defs.draw = (ctx, { children }, context) => {

  Children.forEach(children, child => {
    if (isValidElement(child) && child.props.id) {
      context.defs[child.props.id] = box => child.type.draw(ctx, child.props, context, box)
    }
  })

  return {
    stop: true
  }
}
