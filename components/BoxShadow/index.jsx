import { View } from '@tarojs/components'
import { useMemo } from 'react'
import { colorToRgb, px } from '@/duxapp/utils'
import classNames from 'classnames'

export const BoxShadow = ({
  color = '#999',
  border = 8,
  radius = 0,
  opacity = 0.2,
  x = 0,
  y = 0,
  children,
  style,
  className,
  ...props
}) => {

  const rgb = useMemo(() => colorToRgb(color), [color])

  return <View
    style={{
      ...radius ? { borderRadius: px(radius) } : {},
      ...style,
      boxShadow: `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity || 1}) ${px(x)} ${px(y)} ${px(border)}`
    }}
    className={classNames('overflow-hidden bg-white', className)}
    {...props}
  >
    {children}
  </View>
}
