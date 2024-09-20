import { View as NativeView } from 'react-native'
import ClickableSimplified from '@tarojs/components-rn/dist/components/ClickableSimplified'
import { forwardRef } from 'react'

const ClickView = ClickableSimplified(NativeView)

export const View = forwardRef(({
  onClick,
  ...props
}, ref) => {
  if (onClick) {
    return <ClickView ref={ref} onClick={onClick} {...props} />
  }
  return <NativeView ref={ref} {...props} />
})
