import { useEffect, useRef } from 'react'
import { View } from '@tarojs/components'
import { duxappTheme, pxNum, useForceUpdate } from '@/duxapp'
import classNames from 'classnames'

const isObject = val => val !== null && typeof val === 'object'

export const ProgressCircle = ({
  children,
  loading,
  value = loading ? 10 : 0,
  size = 200,
  color = duxappTheme.primaryColor,
  background = '#e5e9f2',
  clockwise = true,
  strokeWidth = 20,
  strokeLinecap = 'round',
  style,
  className,
  ...props
}) => {

  size = pxNum(size)
  strokeWidth = pxNum(strokeWidth / (size / 100))

  const forceUpdate = useForceUpdate()

  const oldValue = useRef(loading ? value : 0)
  const rotate = useRef(-90)
  const refRandomId = Math.random().toString(36).slice(-8)
  const animateIdRef = useRef(0)

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
        animateIdRef.current = window.requestAnimationFrame(animate)
      } else {
        window.cancelAnimationFrame(animateIdRef.current)
      }
    }

    animateIdRef.current = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(animateIdRef.current)
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

  const stop = () => {
    if (!isObject(color)) {
      return []
    }
    const colorArr = Object.keys(color).sort(
      (a, b) => parseFloat(a) - parseFloat(b)
    )
    const stopArr = []
    colorArr.forEach(item => {
      stopArr.push({
        key: item,
        value: color[item]
      })
    })
    return stopArr
  }

  const format = progress => Math.min(Math.max(+progress, 0), 100)

  const circleStyle = () => {
    const stopArr = stop()
    const radius = 50 - strokeWidth / 2
    const perimeter = 2 * Math.PI * radius
    const progress = +oldValue.current
    const offset =
      perimeter - (perimeter * Number(format(parseFloat(progress.toFixed(1))))) / 100
    const realColor = isObject(color) ? `url(#${refRandomId})` : color

    const defs = stopArr.length
      ? `<defs><linearGradient id='${refRandomId}' x1='0%' y1='0%' x2='0%' y2='100%'>${stopArr
        .map(
          item => `<stop offset='${item.key}' stop-color='${item.value}' />`
        )
        .join('')}</linearGradient></defs>`
      : ''

    const svgContent = `
      <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
        ${defs}
        <circle cx='50' cy='50' r='${radius}' stroke='${background}' stroke-width='${strokeWidth}' fill='none' />
        <circle cx='50' cy='50' r='${radius}' stroke='${realColor}' stroke-width='${strokeWidth}' stroke-dasharray='${perimeter}' stroke-dashoffset='${clockwise ? offset : -offset}' stroke-linecap='${strokeLinecap}' fill='none' transform='rotate(${rotate.current} 50 50)' />
      </svg>`

    return {
      ...style,
      background: `url("data:image/svg+xml,${encodeURIComponent(svgContent)}")`,
      height: size,
      width: size
    }
  }

  return (
    <View
      style={circleStyle()}
      className={classNames('items-center justify-center', className)}
      {...props}
    >
      {children}
    </View>
  )
}
