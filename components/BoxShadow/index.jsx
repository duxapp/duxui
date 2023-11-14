import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo } from 'react'
import { colorToRgb } from '@/duxapp/utils'

export function BoxShadow({
  color = '#999',
  border = 10,
  radius = 0,
  opacity = 0.2,
  x = 0,
  y = 0,
  children,
  style,
  ...props
}) {

  const rgb = useMemo(() => colorToRgb(color), [color])

  return <View
    style={{
      borderRadius: Taro.pxTransform(radius),
      ...style,
      overflow: 'hidden',
      boxShadow: `${Taro.pxTransform(x)} ${Taro.pxTransform(y)} ${Taro.pxTransform(border)} rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity || 1})`
    }}
    {...props}
  >
    {children}
  </View>
}
