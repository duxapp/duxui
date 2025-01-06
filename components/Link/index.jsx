import { route } from '@/duxapp'
import { cloneElement, isValidElement } from 'react'
import { View } from '../common/View'

export const Link = ({
  url,
  style,
  className,
  useChildren,
  children,
  ...props
}) => {

  if (useChildren && isValidElement(children)) {
    return cloneElement(children, {
      onClick: e => {
        children.props.onClick?.(e)
        route.nav(url)
      }
    })
  }

  return <View style={style} className={className} onClick={() => route.nav(url)} {...props}>
    {children}
  </View>
}
