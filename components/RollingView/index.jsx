import classNames from 'classnames'
import { View } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { Animated, nextTick, transformStyle } from '@/duxapp'
import './index.scss'

export const RollingView = ({
  children,
  style,
  className,
  duration = 5000,
  vertical,
  ...props
}) => {

  const [keys, setKeys] = useState([1, 2])

  const an = useRef()

  useEffect(() => {
    if (!an.current) {
      an.current = Animated.create({
        duration: 3000
      })
    }
  }, [])

  return (
    <View
      style={style}
      className={classNames('overflow-hidden', className)}
      {...props}
    >
      {
        keys.map(item => <Item
          key={item}
          start={item === 1}
          vertical={vertical}
          an={an}
          onEnd={() => {
            setKeys(old => {
              return [old[1], old[1] + 1]
            })
          }}
          duration={duration}
        >{children}</Item>)
      }
    </View>
  )
}

const Item = ({ children, start, vertical, duration, onEnd, an }) => {

  const [animation, setAnimation] = useState(Animated.defaultState)

  const translate = vertical ? 'translateY' : 'translateX'

  useEffect(() => {
    nextTick(() => {
      const d = start ? duration : duration * 2
      setAnimation(an.current[translate]('-100%').step({
        duration: d
      }).export())
      onEnd && setTimeout(onEnd, d)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, start])

  return <Animated.View
    animation={animation}
    className={classNames(
      'RollingView__item',
      'RollingView__item--' + (vertical ? 'vertical' : 'default')
    )}
    style={{
      transform: transformStyle({
        [translate]: !start ? '100%' : '0%'
      })
    }}
  >
    {children}
  </Animated.View>
}
