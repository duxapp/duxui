import { View } from '@tarojs/components'
import { memo, useCallback } from 'react'

const directionMap = [
  ['top left', 'top', 'top right'],
  ['left', null, 'right'],
  ['bottom left', 'bottom', 'bottom right'],
]

function getDirction(start, end) {
  const d = directionMap[end.y - start.y + 1]?.[end.x - start.x + 1]
  if (!d) return null
  return `to ${d}`
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
  locations: [],
  colors: []
}

export const LinearGradient = memo(({
  start = defaultProps.start,
  end = defaultProps.end,
  colors = defaultProps.colors,
  locations = defaultProps.locations,
  useAngle = false,
  angle = 0,
  style,
  className,
  children,
  ...otherProps
}) => {

  const getAngle = useCallback(() => {

    if (useAngle) {
      return angle + 'deg'
    }

    const direction = getDirction(start, end)
    if (direction) return direction

    // Math.atan2 handles Infinity
    const _angle =
      Math.atan2(
        this.state.width * (end.y - start.y),
        this.state.height * (end.x - start.x)
      ) +
      Math.PI / 2
    return _angle + 'rad'
  }, [angle, end, start, useAngle])

  const getColors = useCallback(() => {
    return colors.map((color, index) => {
      const location = locations[index]
      let locationStyle = ''
      if (location) {
        locationStyle = ' ' + location * 100 + '%'
      }
      return color + locationStyle
    })
      .join(',')
  }, [colors, locations])

  return <View
    {...otherProps}
    className={className}
    style={{
      ...style,
      backgroundImage: `linear-gradient(${getAngle()},${getColors()})`,
    }}
  >
    {children}
  </View>
})
