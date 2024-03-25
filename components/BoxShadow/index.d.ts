import { ReactNode } from 'react'
import { StandardProps } from '@tarojs/components/types/common'

interface BoxShadowProps extends StandardProps {
  /** 阴影颜色，默认值为 '#999' */
  color?: string
  /** 阴影边框大小，默认值为 10 */
  border?: number
  /** 阴影不透明度，默认值为 0.1 */
  opacity?: number
  /** 阴影 x 轴偏移量，默认值为 0 */
  x?: number
  /** 阴影 y 轴偏移量，默认值为 0 */
  y?: number
  /** 子组件 */
  children?: ReactNode
  /** 样式 */
  style?: React.CSSProperties
  /** 其他属性 */
  [key: string]: any
}

export function BoxShadow(props: BoxShadowProps): JSX.Element
