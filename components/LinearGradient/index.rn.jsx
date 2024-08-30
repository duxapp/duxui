import { View } from '@tarojs/components'
import { Svg, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg'
import { useMemo } from 'react'

const deg = degree => {
  if (typeof degree !== 'number' || Math.abs(degree) === Infinity) throw new Error('角度必须是数字类型')

  degree %= 360
  if (degree < 0) {
    degree = 360 - degree
  }

  if (degree === 0) {
    return res([0.5, 1], [0.5, 0])
  } else if (degree === 45) {
    return res([0, 1], [1, 0])
  } else if (degree === 90) {
    return res([0, 0.5], [1, 0.5])
  } else if (degree === 135) {
    return res([0, 0], [1, 1])
  } else if (degree === 180) {
    return res([0.5, 0], [0.5, 1])
  } else if (degree === 225) {
    return res([1, 0], [0, 1])
  } else if (degree === 270) {
    return res([1, 0.5], [0, 0.5])
  } else if (degree === 315) {
    return res([1, 1], [0, 0])
  }
  if (degree < 45) {
    const arc = Math.PI / (180 / degree)
    return res([0.5 - Math.tan(arc) * 0.5, 1], [0.5 + Math.tan(arc) * 0.5, 0])
  } else if (degree < 90) {
    const arc = Math.PI / (180 / (90 - degree))
    return res([0, 0.5 + Math.tan(arc) * 0.5], [1, 0.5 - Math.tan(arc) * 0.5])
  } else if (degree < 135) {
    const arc = Math.PI / (180 / (degree - 90))
    return res([0, 0.5 - Math.tan(arc) * 0.5], [1, 0.5 + Math.tan(arc) * 0.5])
  } else if (degree < 180) {
    const arc = Math.PI / (180 / (45 - (degree - 135)))
    return res([0.5 - Math.tan(arc) * 0.5, 0], [0.5 + Math.tan(arc) * 0.5, 1])
  } else if (degree < 225) {
    const arc = Math.PI / (180 / (degree - 180))
    return res([0.5 + Math.tan(arc) * 0.5, 0], [0.5 - Math.tan(arc) * 0.5, 1])
  } else if (degree < 270) {
    const arc = Math.PI / (180 / (45 - (degree - 225)))
    return res([1, 0.5 - Math.tan(arc) * 0.5], [0, 0.5 + Math.tan(arc) * 0.5])
  } else if (degree < 315) {
    const arc = Math.PI / (180 / (degree - 270))
    return res([1, 0.5 + Math.tan(arc) * 0.5], [0, 0.5 - Math.tan(arc) * 0.5])
  } else if (degree < 360) {
    const arc = Math.PI / (180 / (45 - (degree - 315)))
    return res([0.5 + Math.tan(arc) * 0.5, 1], [0.5 - Math.tan(arc) * 0.5, 0])
  } else {
    return res([0.5, 1], [0.5, 0])
  }
}

const res = (start, end) => {
  return { start: { x: start[0], y: start[1] }, end: { x: end[0], y: end[1] } }
}

const defaultProps = {
  start: {
    x: 0.5,
    y: 0,
  },
  end: {
    x: 0.5,
    y: 1,
  },
  locations: []
}

export const LinearGradient = ({
  start = defaultProps.start,
  end = defaultProps.end,
  colors,
  locations = defaultProps.locations,
  useAngle,
  angle = 0,
  style,
  children,
  ...props
}) => {

  const userProps = useMemo(() => {
    if (!useAngle) {
      return {
        start,
        end
      }
    } else {
      return deg(angle)
    }
  }, [useAngle, start, end, angle])

  return <View {...props} style={style} className='overflow-hidden'>
    {colors.length > 1 && <Svg className='inset-0 absolute'>
      <SvgLinearGradient id='gradient' x1={`${userProps.start.x * 100}%`} y1={`${userProps.start.y * 100}%`} x2={`${userProps.end.x * 100}%`} y2={`${userProps.end.y * 100}%`}>
        {
          colors.map((color, index) => {
            const offset = locations[index] || (index / (colors.length - 1))
            let stopOpacity = 1
            // 计算rgba不透明度
            if (color.startsWith('rgba(')) {
              stopOpacity = color.split(',')[3].trim()
              stopOpacity = +stopOpacity.substring(0, stopOpacity.length - 1)
            }
            return <Stop key={index} offset={`${offset * 100}%`} stopColor={color} stopOpacity={stopOpacity} />
          })
        }
      </SvgLinearGradient>
      <Rect x='0' y='0' width='100%' height='100%' fill='url(#gradient)' />
    </Svg>}
    {children}
  </View>
}
