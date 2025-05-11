import { useImperativeHandle, forwardRef, useMemo, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import { Svg, Path, PanResponder, SvgToImage } from '../Svg'
import { formConfig } from '../Form/config'

export const Sign = forwardRef(({ color = '#333', size = 3, style, className, onChange }, ref) => {

  const data = useRef({
    touchCount: 0,
    startCount: 0
  })

  const svgToImage = useRef()

  const [isDrawing, setIsDrawing] = useState(false)

  const [myAllList, setMyAllList] = useState([])

  const [drawPath, setDrawPath] = useState('')

  const drawPathRef = useRef(drawPath)
  drawPathRef.current = drawPath

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
        data.current.startCount = data.current.touchCount
      },

      onPanResponderMove: evt => {

        data.current.touchCount++

        const pointX = evt.nativeEvent.locationX
        const pointY = evt.nativeEvent.locationY

        setDrawPath(old => `${old}${old.endsWith('L') ? '' : ','}${pointX},${pointY}`)
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: () => {
        setIsDrawing(false)
        const obj = {
          touch: data.current.touchCount - data.current.startCount,
          path: drawPathRef.current
        }
        setMyAllList(old => [...old, obj])
      },

      onPanResponderTerminate: () => { },

      onShouldBlockNativeResponder: () => true
    })
  }, [])

  useImperativeHandle(ref, (() => {
    return {
      //撤销
      revoke() {
        setDrawPath('')
        setMyAllList(old => {
          const item = old.pop()
          if (item) {
            data.current.touchCount -= item.touch
          }
          return [...old]
        })
      },

      //清空
      clear() {
        setDrawPath('')
        setMyAllList([])
        data.current.touchCount = 0
      },

      // 保存画板内容
      async save(getTempFilePath) {
        if (data.current.touchCount < 30) {
          throw '笔画太少了'
        }

        const { tempFilePath } = await svgToImage.current.capture()

        if (getTempFilePath) {
          onChange?.(tempFilePath)
          return tempFilePath
        }

        const uploadTempFile = formConfig.getUploadTempFile('uploadTempFile')

        const [url] = await uploadTempFile([{ path: tempFilePath }])

        onChange?.(url)

        return url
      }
    }
  }))

  return <View
    className={className}
    style={style}
  >
    <SvgToImage
      ref={svgToImage}
      option={{ format: 'png', quality: 0.8 }}
    >
      <Svg height='100%' width='100%' {...panResponderDrawLine.panHandlers}>
        {
          myAllList.map((item, id) => {
            return (
              <Path
                key={id}
                d={item.path}
                fill='none'
                strokeLinecap='round'
                stroke={color}
                strokeWidth={size}
              />
            )
          })
        }
        {isDrawing && !!drawPath && !drawPath.endsWith('L') && (
          <Path
            d={drawPath}
            fill='none'
            strokeLinecap='round'
            stroke={color}
            strokeWidth={size}
          />
        )}
      </Svg>
    </SvgToImage>
  </View>
})
