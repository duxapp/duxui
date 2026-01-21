import { RichText } from '@tarojs/components'
import { htmlParse } from '../utils/html'

export const HtmlView = ({
  html,
  style,
  className
}) => {
  return <RichText className={className} style={style} nodes={htmlParse(html)} />
}
