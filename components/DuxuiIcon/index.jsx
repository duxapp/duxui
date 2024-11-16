import { Text } from '@tarojs/components'
import { useMemo } from 'react'
import { font, px } from '@/duxapp/utils'
import icons from './icons.json'
import './index.scss'

if (process.env.TARO_ENV === 'rn' || process.env.TARO_ENV === 'harmony') {
  font.loadLocal('DuxuiIcon', require('./DuxuiIcon.ttf'))
}

export const DuxuiIcon = ({ name, color, size, style, className, __hmStyle, ...props }) => {

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

  if (!icons[name]) {
    return console.log(`DuxuiIcon的${name}图标不存在`)
  }

  return <Text
    className={`DuxuiIcon${className ? ' ' + className : ''}`}
    style={_style}
    {...props}
  >
    {String.fromCharCode(icons[name])}
  </Text>
}
