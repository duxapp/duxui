import { Text } from '@tarojs/components'
import { useMemo } from 'react'
import { font, px } from '@/duxapp/utils'
import icons from './icons.json'
import './index.scss'

font.load('DuxuiIcon', 'https://pictcdn.client.jujiang.me/fonts/DuxuiIcon.1728705176383.ttf')

export const DuxuiIcon = ({ name, color, size, style, className, ...props }) => {

  const _style = useMemo(() => {
    const sty = { ...style }
    if (color) {
      sty.color = color
    }
    if (size) {
      sty.fontSize = px(size)
    }
    return sty
  }, [color, size, style])

  const status = font.useFont('DuxuiIcon')

  if (!icons[name]) {
    return console.log(`DuxuiIcon的${name}图标不存在`)
  }

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
