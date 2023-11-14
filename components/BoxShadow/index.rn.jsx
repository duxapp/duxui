import Taro from '@tarojs/taro'
import ClickableSimplified from '@tarojs/components-rn/dist/components/ClickableSimplified'
import { useCallback, useMemo, useState, memo } from 'react'
import Svg, { Rect, Defs, LinearGradient, Stop, RadialGradient, Path } from 'react-native-svg'
import { View, StyleSheet } from 'react-native'
import { colorToRgb } from '@/duxapp/utils'

const ClickView = ClickableSimplified(View)

const SVGShadow = memo(({
  color = '#999',
  border = 10,
  radius = 0,
  opacity = 0.1,
  x = 0,
  y = 0,
  size
}) => {

  border = Taro.pxTransform(border)
  x = Taro.pxTransform(x)
  y = Taro.pxTransform(y)


  const [rectWidth, rectHeight] = useMemo(() => {
    if (!size.width) {
      return [0, 0]
    }
    return [size.width - radius * 2, size.height - radius * 2]
  }, [size.width, size.height, radius])

  //format the color
  const rgb = useMemo(() => colorToRgb(color), [color])

  //the same parts for gradients
  const linear = useCallback(key => {
    return [
      <Stop offset={0} stopColor={color} stopOpacity={opacity} key={key + 'Linear0'} />,
      <Stop offset={1} stopColor={color} stopOpacity={0} key={key + 'Linear1'} />
    ]
  }, [color, opacity])

  const radial = useCallback(key => {
    return [
      <Stop offset={0} stopColor={color} stopOpacity={opacity} key={key + 'Radial0'} />,
      <Stop offset={radius / (border + radius)} stopColor={color} stopOpacity={opacity} key={key + 'Radial1'} />,
      <Stop offset={1} stopColor={color} stopOpacity={0} key={key + 'Radial2'} />
    ]
  }, [color, border, opacity, radius])

  const outerWidth = border + radius
  return <Svg
    height={size.height + border * 2 + radius * 2}
    width={size.width + border * 2 + radius * 2}
    style={[{ top: y - border, left: x - border }, styles.svg]}
  >
    <Defs>
      <LinearGradient id='top' x1='0%' x2='0%' y1='100%' y2='0%'>{linear('BoxTop')}</LinearGradient>
      <LinearGradient id='bottom' x1='0%' x2='0%' y1='0%' y2='100%'>{linear('BoxBottom')}</LinearGradient>
      <LinearGradient id='left' x1='100%' y1='0%' x2='0%' y2='0%'>{linear('BoxLeft')}</LinearGradient>
      <LinearGradient id='right' x1='0%' y1='0%' x2='100%' y2='0%' >{linear('BoxRight')}</LinearGradient>

      <RadialGradient id='border-left-top' r='100%' cx='100%' cy='100%' fx='100%' fy='100%'>{radial('BoxLeftTop')}</RadialGradient>
      <RadialGradient id='border-left-bottom' r='100%' cx='100%' cy='0%' fx='100%' fy='0%'>{radial('BoxLeftBottom')}</RadialGradient>
      <RadialGradient id='border-right-top' r='100%' cx='0%' cy='100%' fx='0%' fy='100%'>{radial('BoxRightTop')}</RadialGradient>
      <RadialGradient id='border-right-bottom' r='100%' cx='0%' cy='0%' fx='0%' fy='0%'>{radial('BoxRightBottom')}</RadialGradient>
    </Defs>

    <Path d={`M 0 ${outerWidth},Q 0 0 ${outerWidth} 0,v ${border},q ${-radius} 0 ${-radius} ${radius},h ${-border},z`} fill='url(#border-left-top)' />
    <Path d={`M ${rectWidth + border + radius} 0,q ${outerWidth} 0 ${outerWidth} ${outerWidth},h ${-border},q 0 ${-radius} ${-radius} ${-radius},v ${-border},z`} fill='url(#border-right-top)' />
    <Path d={`M ${rectWidth + border + 2 * radius} ${rectHeight + border + radius},h ${border},q 0 ${outerWidth} -${outerWidth} ${outerWidth},v ${-border},q ${radius} 0 ${radius} ${-radius},z`} fill='url(#border-right-bottom)' />
    <Path d={`M 0 ${rectHeight + border + radius},q 0 ${outerWidth} ${outerWidth} ${outerWidth},v ${-border},q ${-radius} 0 ${-radius} ${-radius},h ${-border},z`} fill='url(#border-left-bottom)' />

    <Rect x={outerWidth} y={0} width={rectWidth} height={border} fill='url(#top)' />
    <Rect x={0} y={outerWidth} width={border} height={rectHeight} fill='url(#left)' />
    <Rect x={rectWidth + border + 2 * radius} y={outerWidth} width={border} height={rectHeight} fill='url(#right)' />
    <Rect x={outerWidth} y={rectHeight + border + 2 * radius} width={rectWidth} height={border} fill='url(#bottom)' />

    {(x !== 0 || y !== 0) && <Path d={`M ${outerWidth} ${border},h ${rectWidth},q ${radius} 0 ${radius} ${radius},v ${rectHeight},q 0 ${radius} -${radius} ${radius},h -${rectWidth},q -${radius} 0 -${radius} -${radius},v -${rectHeight},q 0 -${radius} ${radius} -${radius}`} fill={`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity || 1})`} />}
  </Svg>
})

export const BoxShadow = ({
  color = '#999',
  border = 10,
  opacity = 0.1,
  x = 0,
  y = 0,
  radius = 0,
  style,
  children,
  ...props
}) => {

  const [size, setSize] = useState({})

  // 圆角如果大于矩形的短边的一半，则圆角将会报错，所以去最小值
  radius = Math.min(Taro.pxTransform(radius), size.width / 2 || 0, size.height / 2 || 0)

  const layout = useCallback(e => {
    setSize(e.nativeEvent.layout)
  }, [])

  return (
    <ClickView {...props} style={[style, { borderRadius: radius }]} onLayout={layout}>
      {!!size.height && <SVGShadow
        size={size}
        color={color}
        border={border}
        opacity={opacity}
        radius={radius}
        x={x}
        y={y}
      />}
      <View style={[{ borderRadius: radius }, styles.root]} />
      {children}
    </ClickView>
  )
}

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
  },
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
  }
})
