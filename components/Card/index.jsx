import { View } from '@tarojs/components'
import classNames from 'classnames'
import { duxuiTheme, px } from '@/duxui/utils'
import { Text } from '../Text'
import { BoxShadow } from '../BoxShadow'
import './index.scss'

export const Card = ({
  shadow = duxuiTheme.card.shadow,
  radius = duxuiTheme.card.radius,
  verticalPadding = true,
  margin,
  disableMarginBottom,
  disableMarginTop,
  children,
  className,
  row,
  wrap,
  justify,
  items,
  style,
  ...props
}) => {

  const cn = classNames(
    'Card',
    !verticalPadding && 'Card--v-p',
    margin && 'Card--margin',
    disableMarginBottom && 'Card--margin-bottom',
    disableMarginTop && 'Card--margin-top',
    justify ? 'justify-' + justify : '',
    items ? 'items-' + items : '',
    row && 'flex-row',
    wrap && 'flex-wrap',
    className
  )

  if (shadow) {
    return <BoxShadow className={cn} radius={radius} style={style} {...props}>
      {children}
    </BoxShadow>
  } else {
    return <View className={cn} style={{ ...style, borderRadius: px(radius) }} {...props}>
      {children}
    </View>
  }

}

const Title = ({
  numberOfLines = 1,
  line = true,
  children,
  sizeStyle = {},
  style,
  className,
  ...props
}) => {
  return <View style={style} className={classNames('CardTitle', className)} {...props}>
    {line && <View className='CardTitle__line' />}
    <Text className='CardTitle__text' style={sizeStyle} numberOfLines={numberOfLines}>{children}</Text>
  </View>
}

Card.Title = Title
