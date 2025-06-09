import { View } from '@tarojs/components'
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

  const rgb = colorToRgb(color)

  return <View
    style={{
      ...radius ? { borderRadius: px(radius) } : {},
      ...style,
      boxShadow: `${px(x, true)} ${px(y, true)} ${px(border, true)} 0 rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity || 1})`
    }}
    className={classNames('overflow-hidden bg-white', className)}
    {...props}
  >
    {children}
  </View>
}
