import { View as NativeView } from 'react-native'
import useClickable from '@tarojs/components-rn/dist/components/hooks/useClickable'
import { forwardRef } from 'react'

export const View = forwardRef((props, ref) => {
  const clickable = useClickable(props)
  return <NativeView ref={ref} {...clickable} />
})
