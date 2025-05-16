import { useRef, useState, useMemo } from 'react'
import { Rect, SvgComponent, PanResponder, Line, Ellipse } from '../Svg'
import { getKey } from './util'

export const Vector = ({ mode, stroke = '#333', strokeWidth = 2, isFill, onSubmit, ...props }) => {

  const [start, setStart] = useState()

  const [end, setEnd] = useState()

  const refs = useRef({}).current
  refs.onSubmit = onSubmit
  refs.props = {
    stroke,
    strokeWidth,
    fill: isFill ? stroke : 'none',
    ...props
  }
  refs.mode = mode
  refs.start = start
  refs.end = end

  const type = types[mode]

  const panResponderDrawLine = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: evt => {
        setStart([evt.nativeEvent.locationX, evt.nativeEvent.locationY])
      },

      onPanResponderMove: evt => {
        setEnd([evt.nativeEvent.locationX, evt.nativeEvent.locationY])
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: () => {

        if (refs.end) {
          refs.onSubmit?.({
            type: type.type,
            attr: {
              ...refs.props,
              ...type.getProps(refs.start, refs.end)
            },
            key: getKey()
          })
        }
        setStart()
        setEnd()
      },

      onPanResponderTerminate: () => { },

      onShouldBlockNativeResponder: () => true
    })
  }, [refs, type])

  const Comp = type.comp

  return <SvgComponent>
    {start && end && <Comp
      {...refs.props}
      {...type.getProps(start, end)}
    />}
    <Rect
      width='100%'
      height='100%'
      fill='none'
      {...panResponderDrawLine.panHandlers}
    />
  </SvgComponent>
}

const types = {
  rect: {
    type: 'Rect',
    comp: Rect,
    getProps: (start, end) => {
      return {
        x: start[0],
        y: start[1],
        width: end[0] - start[0],
        height: end[1] - start[1]
      }
    }
  },
  ellipse: {
    type: 'Ellipse',
    comp: Ellipse,
    getProps: (start, end) => {
      // 提取坐标
      const x1 = start[0]
      const y1 = start[1]
      const x2 = end[0]
      const y2 = end[1]

      // 计算矩形边界
      const xMin = Math.min(x1, x2)
      const xMax = Math.max(x1, x2)
      const yMin = Math.min(y1, y2)
      const yMax = Math.max(y1, y2)

      // 计算椭圆中心 (cx, cy)
      const cx = (xMin + xMax) / 2
      const cy = (yMin + yMax) / 2

      // 计算椭圆的 x 半径 (rx) 和 y 半径 (ry)
      const rx = (xMax - xMin) / 2
      const ry = (yMax - yMin) / 2

      // 返回 SVG 椭圆参数
      return { cx, cy, rx, ry }
    }
  },
  line: {
    type: 'Line',
    comp: Line,
    getProps: (start, end) => {
      return {
        x1: start[0],
        y1: start[1],
        x2: end[0],
        y2: end[1]
      }
    }
  }
}

function calculateSVGEllipseParams(point1, point2) {
  // 提取坐标
  const x1 = point1[0]
  const y1 = point1[1]
  const x2 = point2[0]
  const y2 = point2[1]

  // 计算矩形边界
  const xMin = Math.min(x1, x2)
  const xMax = Math.max(x1, x2)
  const yMin = Math.min(y1, y2)
  const yMax = Math.max(y1, y2)

  // 计算椭圆中心 (cx, cy)
  const cx = (xMin + xMax) / 2
  const cy = (yMin + yMax) / 2

  // 计算椭圆的 x 半径 (rx) 和 y 半径 (ry)
  const rx = (xMax - xMin) / 2
  const ry = (yMax - yMin) / 2

  // 返回 SVG 椭圆参数
  return { cx, cy, rx, ry }
}
