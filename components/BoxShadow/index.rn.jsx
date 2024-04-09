import { StyleSheet } from 'react-native'
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow'
import ClickableSimplified from '@tarojs/components-rn/dist/components/ClickableSimplified'
import { px } from '@/duxapp/utils'

const ClickShadowedView = ClickableSimplified(ShadowedView)

export const BoxShadow = ({
  color = '#999',
  border = 8,
  opacity = 0.2,
  radius = 0,
  x = 0,
  y = 0,
  style,
  children,
  onClick,
  ...props
}) => {

  const View = onClick ? ClickShadowedView : ShadowedView

  return <View
    style={[{ borderRadius: radius }, styles.view, style, shadowStyle({
      color,
      radius: px(border),
      opacity,
      offset: [x, y]
    })]}
    onClick={onClick}
    {...props}
  >
    {children}
  </View>
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#fff'
  }
})
