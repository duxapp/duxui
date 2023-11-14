import { Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo } from 'react'
import { font } from '@/duxapp/utils'
import icons from './icons.json'
import './index.scss'

font.load('DuxuiIcon', 'https://pictcdn.client.jujiang.me/fonts/DuxuiIcon.1697597266897.ttf')

export const DuxuiIcon = ({ name, color, size, style, className, ...props }) => {

  const _style = useMemo(() => {
    const sty = { ...style }
    if (color) {
      sty.color = color
    }
    if (size) {
      sty.fontSize = Taro.pxTransform(size)
    }
    return sty
  }, [color, size, style])

  if (!icons[name]) {
    return console.log(`DuxuiIcon的${name}图标不存在`)
  }

  const status = font.useFont('DuxuiIcon')

  if (!status) {
    return null
  }

  return <Text
    className={`DuxuiIcon${className ? ' ' + className : ''}`}
    style={_style}
    {...props}
  >
    {String.fromCharCode(icons[name])}
  </Text>
}
