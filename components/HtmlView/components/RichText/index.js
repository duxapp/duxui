import { RichText as TaroRichText } from '@tarojs/components'
import './index.scss'

export const RichText = ({ style, ...props }) => {
  return <TaroRichText style={{ fontSize: '16px', ...style }} {...props} />
}
