import { View } from '@tarojs/components'
import { useCallback, useEffect, useRef } from 'react'

export const LongPress = ({
  onPress,
  onLongPress,
  ...props
}) => {

  const timer = useRef(null)

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])

  const touchStart = useCallback(e => {
    timer.current = setTimeout(() => {
      timer.current = null
      onLongPress?.(e)
    }, 600)
  }, [onLongPress])

  const touchEnd = useCallback(e => {
    if (timer.current) {
      onPress?.(e)
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [onPress])



  return <View {...props} onTouchStart={touchStart} onTouchEnd={touchEnd} />
}
