import { CSSProperties, Component } from 'react'

type props = Partial<{
  /** html文本 */
  html: string,
  /** 组件样式 应用在最外层 */
  style?: CSSProperties,
  /** className */
  className?: string
  /** 是否开启图片预览 */
  previewImage?: boolean
  /** 点击带有href的标签的回调 */
  onLinkClick?: (href: string) => void
}>

/**
 * 用于渲染富文本内容 对于复杂的富文本内容可能无法正常渲染 支持ReactNative
 * @example
 * <RichText html='<p>文本内容</p>' />
 */
export class HtmlView extends Component<props>{

}
