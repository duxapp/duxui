import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react'
import { Svg, Image, Text, Rect, Path, G, SvgToImage, SvgComponent, Circle, Line, Animated, PanResponder, Ellipse } from '../Svg'
import { getKey } from './util'
import { Painting } from './Painting'
import { Vector } from './Vector'
import { TextInput } from './Text'

const GAnimated = /*@__PURE__*/ Animated.createAnimatedComponent(G)

export const SvgEditor = forwardRef(({
  defaultValue = [],
  onChange,
  mode = 'edit',
  pathProps,
  rectProps,
  ellipseProps,
  lineProps,
  textProps,
  ...props
}, ref) => {

  const layer = useMemo(() => {
    return defaultValue.map(item => {
      return {
        ...item,
        key: getKey()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const svgToImage = useRef()

  const [select, setSelect] = useState()

  const [, setUpdate] = useState(0)

  useImperativeHandle(ref, () => {
    return {
      add: (...items) => {
        layer.push(...items.map(item => {
          return {
            ...item,
            key: getKey()
          }
        }))
        setUpdate(old => old + 1)
      }
    }
  }, [layer])

  const path = mode === 'path'

  const vector = mode === 'rect' || mode === 'ellipse' || mode === 'line'

  const vectorProps = {
    rect: rectProps,
    ellipse: ellipseProps,
    line: lineProps
  }

  const addLayer = val => {
    layer.push(val)
    setUpdate(old => old + 1)
  }

  return <SvgToImage ref={svgToImage}>
    <Svg {...props}>
      {
        layer.map((item, index) => <Item
          item={item} key={item.key ?? index}
          select={path ? '' : select}
          onChange={() => onChange?.(layer)}
          setSelect={setSelect}
        />)
      }
      {path && <Painting
        {...pathProps}
        onSubmit={addLayer}
      />}
      {vector && <Vector
        {...vectorProps[mode]}
        mode={mode}
        onSubmit={addLayer}
      />}
      {mode === 'text' && <TextInput
        {...textProps}
        onSubmit={addLayer}
      />}
    </Svg>
  </SvgToImage>
})

const Item = ({ item, select, setSelect, onChange }) => {

  const Comp = comps[item.type]

  const [, setUpdate] = useState(0)

  if (!Comp) {
    return null
  }

  const layout = item.layout || {}

  return <SvgComponent>
    {layout.width ?
      <ItemRender
        Comp={Comp}
        item={item}
        select={select}
        setSelect={setSelect}
        onChange={onChange}
      /> :
      <Comp
        {...item.attr}
        onLayout={e => {
          item.layout = e.nativeEvent.layout
          onChange()
          setUpdate(old => old + 1)
        }}
      />
    }
  </SvgComponent>
}

const ItemRender = ({ item, select, setSelect, onChange, Comp }) => {
  const isSelect = select === item.key

  const transform = item.transform || (item.transform = {})

  const layout = item.layout

  const movePan = useRef(new Animated.ValueXY({
    x: transform.translateX ?? 0,
    y: transform.translateY ?? 0
  }, { useNativeDriver: true })).current

  const scalePan = useRef(new Animated.Value(transform.scale ?? 1, { useNativeDriver: true })).current

  const rotatePan = useRef(new Animated.Value(transform.rotate ?? 0, { useNativeDriver: true })).current

  const moveEvent = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setSelect(item.key)
      // 等选择生效之后再执行动画
      Promise.resolve().then(() => {
        movePan.setOffset({
          x: movePan.x._value,
          y: movePan.y._value
        })
        movePan.setValue({ x: 0, y: 0 })
      })
    },
    onPanResponderMove: (e, gestureState) => {
      movePan.setValue({ x: gestureState.dx, y: gestureState.dy })
    },
    onPanResponderRelease: () => {
      movePan.flattenOffset()
      transform.translateX = movePan.x._value
      transform.translateY = movePan.y._value
      onChange()
    }
  })).current

  useEffect(() => {
    if (process.env.TARO_ENV === 'rn') {
      // RN 端需要用动画属性驱动，否则显示不正常
      movePan.setValue({ x: movePan.x._value, y: movePan.y._value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cx = (layout.x + layout.width / 2) || 0
  const cy = (layout.y + layout.height / 2) || 0

  const commonProps = {
    // x: movePan.x,
    // y: movePan.y,
    transform: [
      { translateX: movePan.x },
      { translateY: movePan.y },
      { translateX: cx },
      { translateY: cy },
      { rotate: rotatePan },
      { scale: scalePan },
      { translateX: -cx },
      { translateY: -cy }
    ]
  }

  return <SvgComponent>
    <GAnimated
      {...commonProps}
    >
      <Comp {...item.attr} />
      <Rect
        {...layout}
        fill='none'
        stroke={isSelect ? '#e8e8e8' : 'none'}
        strokeWidth={2 / (transform.scale ?? 1)}
        {...moveEvent.panHandlers}
      />
    </GAnimated>
    {isSelect && <ItemAction
      layout={layout}
      commonProps={commonProps}
      transform={transform}
      onChange={onChange}
      scalePan={scalePan}
      rotatePan={rotatePan}
    />}
  </SvgComponent>
}

const ItemAction = ({ layout, commonProps, scalePan, rotatePan, transform, onChange }) => {

  const xStroke = 2 / (transform.scale ?? 1)

  const scaleEvent = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    // onPanResponderGrant: () => {
    // },
    onPanResponderMove: (e, gestureState) => {

      const centerX = (transform.translateX || 0) + layout.x + layout.width / 2
      const centerY = (transform.translateY || 0) + layout.y + layout.height / 2

      // 获取当前触摸点坐标
      const currentX = e.nativeEvent.locationX - centerX
      const currentY = e.nativeEvent.locationY - centerY

      // 计算当前角度(度数)
      const angle = Math.atan2(currentY, currentX)

      // 计算方向向量
      const ux = Math.cos(angle)
      const uy = Math.sin(angle)

      // 计算投影（点积）
      const projection = gestureState.dx * ux + gestureState.dy * uy

      const scale = transform.scale ?? 1

      scalePan.setValue(Math.max(0.2, (layout.width / 2 * scale + projection) / (layout.width / 2)))
    },
    onPanResponderRelease: () => {
      transform.scale = scalePan._value
      onChange()
    }
  })).current

  const rotateEvent = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    // onPanResponderGrant: () => {
    // },
    onPanResponderMove: e => {

      const centerX = (transform.translateX || 0) + layout.x + layout.width / 2
      const centerY = (transform.translateY || 0) + layout.y + layout.height / 2

      // 获取当前触摸点坐标
      const currentX = e.nativeEvent.locationX - centerX
      const currentY = e.nativeEvent.locationY - centerY

      // 计算当前角度(度数)
      const angle = Math.atan2(currentY, currentX)
      rotatePan.setValue(Math.PI / 2 + angle)
    },
    onPanResponderRelease: () => {
      transform.rotate = rotatePan._value
      onChange()
    }
  })).current

  const scale = transform.scale ?? 1

  return <SvgComponent>
    <GAnimated {...commonProps}>
      <Circle
        cx={layout.x + layout.width}
        cy={layout.y + layout.height}
        r={10 / scale}
        fill='blue'
        stroke='#f2f2f2'
        strokeWidth={xStroke}
        {...scaleEvent.panHandlers}
      />
      <Line
        x1={layout.x + layout.width / 2}
        y1={layout.y}
        x2={layout.x + layout.width / 2}
        y2={layout.y - 20}
        stroke='#f2f2f2'
        strokeWidth={xStroke}
      />
      <Circle
        cx={layout.x + layout.width / 2}
        cy={layout.y - 20}
        r={10 / scale}
        fill='blue'
        stroke='#f2f2f2'
        strokeWidth={xStroke}
        {...rotateEvent.panHandlers}
      />
    </GAnimated>
  </SvgComponent>
}


const comps = {
  Image,
  Text,
  Path,
  Rect,
  Ellipse,
  Line
}
