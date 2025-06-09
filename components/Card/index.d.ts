import { ReactNode } from 'react'
import { BoxShadowProps } from '../BoxShadow'

interface CardProps extends BoxShadowProps {
  /** 是否显示阴影，默认为 true */
  shadow?: boolean
  /** 圆角大小，默认为 24 */
  radius?: number
  /** 是否显示垂直方向上的内边距 默认显示 */
  verticalPadding?: boolean
  /** 是否显示组件之间的边距，默认为 false */
  margin?: boolean
  /** 是否禁用底部边距，默认为 false */
  disableMarginBottom?: boolean
  /** 是否禁用顶部边距，默认为 false */
  disableMarginTop?: boolean
  /** 是否横向排列 */
  row?: boolean
  /** 是否换行 */
  wrap?: boolean
  /** flex 容器在主轴方向上的对齐方式 */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  /** flex 容器在交叉轴方向上的对齐方式 */
  items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
}

interface CardTitleProps {
  numberOfLines?: number // 标题最大行数，默认为 1
  line?: boolean // 是否显示标题左侧的线，默认为 true
  children?: ReactNode // 子元素
}

export const Card: React.FC<CardProps>

export const CardTitle: React.FC<CardTitleProps>
