import { useRef, useState } from 'react'
import { Animated } from 'react-native'
import ClickableSimplified from '@tarojs/components-rn/dist/components/ClickableSimplified'
import { asyncTimeOut } from '@/duxapp'

const ClickView = ClickableSimplified(Animated.View)

export const TouchableOpacity = ({ children, style, activeOpacity = 0.2, ...props }) => {
  const [opacity] = useState(new Animated.Value(1))

  const startTime = useRef()

  // 按下的动画
  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: activeOpacity,
      duration: 100,
      useNativeDriver: true
    }).start()
    startTime.current = Date.now()
  }

  // 松手的动画
  const handlePressOut = async () => {
    const d = Date.now() - startTime.current
    if (d < 120) {
      await asyncTimeOut(120 - d)
    }
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start()
  }

  const RenderView = props.onClick ? ClickView : Animated.View

  return (
    <RenderView
      {...props}
      style={[style, { opacity }]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      {children}
    </RenderView>
  )
}
