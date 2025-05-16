import { useRef, useState, useMemo } from 'react'
import { Rect, Path, SvgComponent, PanResponder } from '../Svg'
import { getKey } from './util'

export const Painting = ({ stroke = '#333', strokeWidth = 2, onSubmit, ...props }) => {

  const [isDrawing, setIsDrawing] = useState(false)

  const [drawPath, setDrawPath] = useState('')

  const refs = useRef({}).current
  refs.onSubmit = onSubmit
  refs.pathProps = {
    d: drawPath,
    stroke,
    strokeWidth,
    ...props
  }

  const panResponderDrawLine = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: evt => {
        setIsDrawing(true)

        const tempfirstX = evt.nativeEvent.locationX
        const tempFirstY = evt.nativeEvent.locationY

        setDrawPath(`M${tempfirstX},${tempFirstY}L`)
      },

      onPanResponderMove: evt => {
        const pointX = evt.nativeEvent.locationX
        const pointY = evt.nativeEvent.locationY
        setDrawPath(old => `${old}${old.endsWith('L') ? '' : ','}${pointX},${pointY}`)
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: () => {
        setIsDrawing(false)
        refs.onSubmit?.({
          type: 'Path',
          attr: {
            fill: 'none',
            strokeLinecap: 'round',
            ...refs.pathProps
          },
          key: getKey()
        })
      },

      onPanResponderTerminate: () => { },

      onShouldBlockNativeResponder: () => true
    })
  }, [refs])

  return <SvgComponent>
    {isDrawing && !!drawPath && !drawPath.endsWith('L') && (
      <Path
        d={drawPath}
        fill='none'
        strokeLinecap='round'
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    )}
    <Rect
      width='100%'
      height='100%'
      fill='none'
      {...panResponderDrawLine.panHandlers}
    />
  </SvgComponent>
}
