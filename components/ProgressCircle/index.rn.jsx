import { px, useForceUpdate } from '@/duxapp'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg'

const isObject = val => val !== null && typeof val === 'object'

export const ProgressCircle = ({
  children,
  loading,
  value = loading ? 10 : 0,
  size = 200,
  color = '#ea4335',
  background = '#e5e9f2',
  clockwise = true,
  strokeWidth = 20,
  strokeLinecap = 'round',
  style,
  ...props
}) => {

  size = px(size)
  strokeWidth = px(strokeWidth)

  const forceUpdate = useForceUpdate()

  const oldValue = useRef(value)
  const rotate = useRef(-90)
  const animateIdRef = useRef(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const startTime = Date.now()
    const startRate = Number(oldValue.current)
    const endRate = Number(value)
    const duration = Math.abs(((startRate - endRate) * 1000) / 100)

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const rate = progress * (endRate - startRate) + startRate
      oldValue.current = Math.min(Math.max(+rate, 0), 100)
      if (endRate > startRate ? rate < endRate : rate > endRate) {
        forceUpdate()
        animateIdRef.current = requestAnimationFrame(animate)
      } else {
        cancelAnimationFrame(animateIdRef.current)
      }
    }

    animateIdRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animateIdRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        rotate.current += 10
        forceUpdate()
      }, 60)
      return () => clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const getGradientStops = () => {
    if (!isObject(color)) return null
    const colorArr = Object.keys(color).sort(
      (a, b) => parseFloat(a) - parseFloat(b)
    )
    return colorArr.map((key) => (
      <Stop key={key} offset={key} stopColor={color[key]} />
    ))
  }

  const progressOffset =
    circumference - (circumference * oldValue.current) / 100

  return (
    <View
      style={{
        width: size,
        height: size,
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {isObject(color) && (
            <LinearGradient id='progressGradient' x1='0' y1='0' x2='0' y2='1'>
              {getGradientStops()}
            </LinearGradient>
          )}
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={background}
          strokeWidth={strokeWidth}
          fill='none'
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isObject(color) ? 'url(#progressGradient)' : color}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={clockwise ? progressOffset : -progressOffset}
          transform={`rotate(${rotate.current} ${size / 2} ${size / 2})`}
          fill='none'
        />
      </Svg>
      <View className='items-center justify-center absolute inset-0' style={style} {...props}>
        {children}
      </View>
    </View>
  )
}
