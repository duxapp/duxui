import { useRef, forwardRef, useMemo, useState, useEffect } from 'react'
import { PullView, pxNum, TopView } from '@/duxapp'
import { View } from '@tarojs/components'
import { getImageInfo } from '@tarojs/taro'
import { Svg, Image, SvgToImage, G } from '../Svg'
import { Column, Row } from '../Flex'
import { Button } from '../Button'
import { Text } from '../Text'
import { Touch } from './event'

export const SvgImageCropper = forwardRef(({
  src,
  width = 300,
  height = 300,
  format,
  quality
}, ref) => {

  const touch = useMemo(() => new Touch(), [])

  const config = touch.useConfig()

  const [imageSize, setImageSize] = useState({})

  useEffect(() => {
    src && getImageInfo({ src }).then(setImageSize)
  }, [src])

  if (!imageSize.width) {
    return <Column style={{ width, height }} />
  }

  const scale = Math.max(
    width / imageSize.width,
    height / imageSize.height
  )

  // 计算缩放后的图片尺寸
  const displayWidth = imageSize.width * scale
  const displayHeight = imageSize.height * scale

  // 计算位置（必定有一个坐标为负值）
  const displayX = (width - displayWidth) / 2 // 可能为负
  const displayY = (height - displayHeight) / 2 // 可能为负

  return <View
    onTouchStart={e => touch.touchStart(e)}
    onTouchMove={e => touch.touchMove(e)}
    onTouchEnd={e => touch.touchEnd(e)}
    onTouchCancel={e => touch.touchCancel(e)}
  >
    <SvgToImage ref={ref} options={{ format, quality }}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <G
          scale={config.scale}
          translateX={config.x}
          translateY={config.y}
        >
          <Image
            href={{ uri: src }}
            width={displayWidth}
            height={displayHeight}
            x={displayX}
            y={displayY}
            preserveAspectRatio='xMidYMid meet'
          />
        </G>
      </Svg>
    </SvgToImage>
  </View>
})

export const svgImageCropper = ({ cropScale = '1:1', ...props } = {}) => {

  const [w, h] = cropScale.split(':').map(v => +v)

  const width = pxNum(680)
  const height = width / w * h

  return new Promise((resolve, reject) => {
    const { remove } = TopView.add([
      SvgImageCropperContent,
      {
        ...props,
        width,
        height,
        onClose: () => {
          remove()
          reject('取消裁剪')
        },
        onSubmit: res => {
          remove()
          resolve(res)
        }
      }
    ])
  })
}

const SvgImageCropperContent = ({ onClose, onSubmit, width, height, ...option }) => {

  const save = useRef()

  const pull = useRef()

  return <PullView side='center' ref={pull} onClose={onClose}>
    <Column style={{ width }} className='bg-white r-3' >
      <Column className='p-3'>
        <Text align='center' size={4} bold>裁剪</Text>
      </Column>
      <Column className='bg-page'>
        <SvgImageCropper width={width} height={height} {...option} ref={save} />
      </Column>
      <Row className='gap-3 p-3'>
        <Button className='flex-grow' type='primary' plain onClick={() => pull.current.close()}>取消</Button>
        <Button className='flex-grow' type='primary'
          onClick={async () => {
            const res = await save.current.capture()
            await pull.current.close(false)
            onSubmit(res)
          }}
        >确认</Button>
      </Row>
    </Column>
  </PullView>
}
