import { useState, useRef, useMemo } from 'react'
import { px, colorToRgb } from '@/duxapp'
import classNames from 'classnames'
import { Svg, Defs, LinearGradient, Stop, Rect, Circle, PanResponder } from '../Svg'
import { Column, Row } from '../Flex'
import { Text } from '../Text'

export const ColorPicker = ({ value: propsValue, onChange, size = 200, preview, style, className, ...props }) => {

  const defaultData = useMemo(() => {
    if (!propsValue) {
      return {
        hue: 0, saturation: 1, value: 1, alpha: 1
      }
    }
    return rgbToHsv(...colorToRgb(propsValue))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 颜色状态 (HSV 模型)
  const [hue, setHue] = useState(defaultData.hue)        // 0-360
  const [saturation, setSaturation] = useState(defaultData.saturation)  // 0-1
  const [value, setValue] = useState(defaultData.value)    // 0-1
  const [alpha] = useState(defaultData.alpha)    // 0-1

  const refs = useRef({}).current
  refs.hue = hue
  refs.saturation = saturation
  refs.value = value

  // 获取当前RGB颜色
  const getCurrentColor = () => {
    return hsvToRgb(refs.hue, refs.saturation, refs.value)
  }

  // HSV转RGB
  const hsvToRgb = (h, s, v) => {
    h = h / 60
    const i = Math.floor(h)
    const f = h - i
    const p = v * (1 - s)
    const q = v * (1 - s * f)
    const t = v * (1 - s * (1 - f))

    let r, g, b
    switch (i) {
      case 0: r = v; g = t; b = p; break
      case 1: r = q; g = v; b = p; break
      case 2: r = p; g = v; b = t; break
      case 3: r = p; g = q; b = v; break
      case 4: r = t; g = p; b = v; break
      default: r = v; g = p; b = q
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // RGB转HEX
  const rgbToHex = (rgb) => {
    return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1).toUpperCase()}`
  }

  // 获取当前颜色字符串
  const getColorString = () => {
    const rgb = getCurrentColor()
    return rgbToHex(rgb)
    // return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
  }

  // 主颜色区域手势处理
  const colorAreaPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: evt => {
        const { locationX, locationY } = evt.nativeEvent
        const newSaturation = Math.max(0, Math.min(1, locationX / size))
        const newValue = Math.max(0, Math.min(1, 1 - locationY / size))

        setSaturation(newSaturation)
        setValue(newValue)

        onChange?.(getColorString())
      },
      onPanResponderRelease: () => {
        onChange?.(getColorString())
      },
    })
  ).current

  // 色相滑块手势处理
  const hueSliderPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: evt => {
        const { locationX } = evt.nativeEvent
        setHue(Math.max(0, Math.min(360, (1 - locationX / size) * 360)))

        onChange?.(getColorString())
      },
      onPanResponderRelease: () => {
        onChange?.(getColorString())
      }
    })
  ).current

  // 透明度滑块手势处理
  // const alphaSliderPanResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderMove: evt => {
  //       const { locationY } = evt.nativeEvent
  //       const newAlpha = Math.max(0, Math.min(1, 1 - locationY / size))
  //       setAlpha(newAlpha)

  //       onChange?.(getColorString())
  //     },
  //     onPanResponderRelease: () => {
  //       onChange?.(getColorString())
  //     },
  //   })
  // ).current

  // 当前颜色
  const currentColor = getCurrentColor()
  const rgbaColor = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${alpha})`

  return <Column className={classNames('gap-2', className)} style={style} {...props}>
    <Svg disabledScroll width={size} height={size}>
      <Defs>
        <LinearGradient id='saturation' x1='0%' y1='0%' x2='100%' y2='0%'>
          <Stop offset='0%' stopColor='#FFF' stopOpacity='1' />
          <Stop offset='100%' stopColor='#FFF' stopOpacity='0' />
        </LinearGradient>
        <LinearGradient id='value' x1='0%' y1='0%' x2='0%' y2='100%'>
          <Stop offset='0%' stopColor='#000' stopOpacity='0' />
          <Stop offset='100%' stopColor='#000' stopOpacity='1' />
        </LinearGradient>
      </Defs>

      <Rect
        width={size}
        height={size}
        fill={`hsl(${hue}, 100%, 50%)`}
      />
      <Rect
        width={size}
        height={size}
        fill='url(#saturation)'
      />
      <Rect
        width={size}
        height={size}
        fill='url(#value)'
      />
      <Circle
        cx={saturation * size}
        cy={(1 - value) * size}
        r={8}
        fill='none'
        stroke='#FFF'
        strokeWidth={2}
      />
      <Rect
        width={size}
        height={size}
        fill='none'
        {...colorAreaPanResponder.panHandlers}
      />
    </Svg>
    <Svg width={size} height={20} disableScroll>
      <Defs>
        <LinearGradient id='hue' x1='0%' y1='0%' x2='100%' y2='0%'>
          <Stop offset='100%' stopColor='#FF0000' />
          <Stop offset='83.33%' stopColor='#FFFF00' />
          <Stop offset='66.67%' stopColor='#00FF00' />
          <Stop offset='50%' stopColor='#00FFFF' />
          <Stop offset='33.33%' stopColor='#0000FF' />
          <Stop offset='16.67%' stopColor='#FF00FF' />
          <Stop offset='0%' stopColor='#FF0000' />
        </LinearGradient>
      </Defs>

      <Rect
        width={size}
        height={20}
        fill='url(#hue)'
      />
      <Rect
        x={(1 - hue / 360) * size - 2}
        width={4}
        height={20}
        fill='none'
        stroke='#fff'
        strokeWidth='1'
      />
      <Rect
        width={size}
        height={20}
        fill='none'
        {...hueSliderPanResponder.panHandlers}
      />
    </Svg>

    {/* <Svg width={30} height={size}>
        <Defs>
          <Pattern
            id='checkerboard'
            patternUnits='userSpaceOnUse'
            width='10'
            height='10'
          >
            <Rect width='5' height='5' fill='#CCC' />
            <Rect x='5' y='5' width='5' height='5' fill='#CCC' />
          </Pattern>

          <LinearGradient id='alpha' x1='0%' y1='0%' x2='0%' y2='100%'>
            <Stop offset='0%' stopColor={hexColor} stopOpacity='1' />
            <Stop offset='100%' stopColor={hexColor} stopOpacity='0' />
          </LinearGradient>
        </Defs>

        <Rect
          width='30'
          height={size}
          fill='url(#checkerboard)'
        />
        <Rect
          width='30'
          height={size}
          fill='url(#alpha)'
        />
        <Rect
          x='0'
          y={(1 - alpha) * size - 2}
          width='30'
          height='4'
          fill='none'
          stroke='#fff'
          strokeWidth='1'
        />
        <Rect
          width='30'
          height={size}
          fill='none'
          {...alphaSliderPanResponder.panHandlers}
        />
      </Svg> */}
    {preview && <Row className='items-center gap-2'>
      <Column
        className='r-1 square border-w1'
        style={{ width: px(50), backgroundColor: rgbaColor, borderColor: '#CCC' }}
      />
      {
        preview === 'rgb' ?
          <Text>{currentColor.r} {currentColor.g} {currentColor.b}</Text> :
          <Text>{rgbToHex(currentColor)}</Text>
      }
    </Row>}
  </Column>
}

function rgbToHsv(r, g, b) {
  // 归一化到 0-1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // 计算 max, min, delta
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  // 计算 Hue
  let hue = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      hue = 60 * (((gNorm - bNorm) / delta) % 6);
    } else if (max === gNorm) {
      hue = 60 * (((bNorm - rNorm) / delta) + 2);
    } else if (max === bNorm) {
      hue = 60 * (((rNorm - gNorm) / delta) + 4);
    }
    if (hue < 0) hue += 360; // 确保在 0-360 范围内
  }

  // 计算 Saturation
  const saturation = max === 0 ? 0 : delta / max;

  // Value 就是 max
  const value = max;

  // Alpha 默认 1
  const alpha = 1;

  return { hue, saturation, value, alpha };
}
