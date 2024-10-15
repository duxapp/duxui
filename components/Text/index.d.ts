import { TextProps as TaroTextProps } from '@tarojs/components'
import { ReactElement } from 'react'

interface TextProps extends TaroTextProps {
  /** 文本颜色 1-4是配置的主题颜色，优先级高于 type */
  color?: 1 | 2 | 3 | 4 | string
  /** 文本主题色 */
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom1' | 'custom2' | 'custom3'
  /** 是否加粗 */
  bold?: boolean
  /**
   * 是否强制换行
   * RN不支持此属性
   */
  break?: boolean
  /** 文字大小 数字1-7使用的是主题配置的字号 数字大于等于12时，将使用px处理 */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | number
  /** 是否有删除线 */
  delete?: boolean
  /** 是否有下划线 */
  underline?: boolean
  /** 显示的行数，超出部分将被截断 */
  numberOfLines?: number
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right' | 'justify'
  /** 容器在主轴方向上的伸缩能力 */
  grow?: boolean
  /** 容器在主轴方向上的收缩能力 */
  shrink?: boolean
  /** 单个元素在交叉轴方向上的对齐方式 */
  self?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /** 子元素 子元素只能是 文本、Text组件、图标组件 */
  children?: string | ReactElement
}

export const Text: React.FC<TextProps>
