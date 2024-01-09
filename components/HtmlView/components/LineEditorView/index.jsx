import { View } from '@tarojs/components'
import { useCallback } from 'react'
import Taro from '@tarojs/taro'
import { Header } from './components/Header'
import { Paragraph } from './components/Paragraph'
import { Video } from './components/Video'
import { Image } from './components/Image'

const comps = {
  header: Header,
  paragraph: Paragraph,
  image: Image,
  video: Video
}

export const LineEditorView = ({
  blocks,
  className,
  style,
  previewImage,
  imageSpace = true
}) => {

  const click = useCallback(item => {
    if (item.type === 'image' && previewImage) {
      Taro.previewImage({
        current: item.data.src,
        urls: blocks.filter(v => v.type === 'image').map(v => v.data.src)
      })
    }
  }, [blocks, previewImage])

  return <View className={className} style={style}>
    {
      blocks.map((item, index) => {
        const Item = comps[item.type]
        if (!Item) {
          console.log('LineEditorView:类型' + item.type + '不支持')
          return null
        }
        return <Item key={index} {...item} onClick={() => click(item)} imageSpace={imageSpace} />
      })
    }
  </View>
}
