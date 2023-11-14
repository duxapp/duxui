import { RichText } from '@tarojs/components'
import { htmlReplace } from '../utils/html'

export const HtmlView = ({
  html,
  style,
  className,
  previewImage,
  onLinkClick
}) => {
  return <RichText className={className} style={style} nodes={htmlReplace(html)} />
}
