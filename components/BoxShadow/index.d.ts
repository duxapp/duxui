import { ReactNode } from 'react'
import { ViewProps } from '@tarojs/components'

interface BoxShadowProps extends ViewProps {
  /** 阴影颜色，默认值为 '#999' */
  color?: string
  /** 阴影边框大小，默认值为 8 */
  border?: number
  /** 阴影不透明度，默认值为 0.2 */
  opacity?: number
  /** 阴影 x 轴偏移量，默认值为 0 */
  x?: number
  /** 阴影 y 轴偏移量，默认值为 0 */
  y?: number
}

export function BoxShadow(props: BoxShadowProps): JSX.Element
