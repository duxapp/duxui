import { ViewProps } from '@tarojs/components'

interface SpaceProps extends ViewProps {
  /** 元素之间的间距 */
  size?: number
  /** 前后是否也使用间距 */
  between?: boolean
  /** 是否横向排列 */
  row?: boolean
  /** 是否换行 */
  wrap?: boolean
  /** flex 容器在主轴方向上的对齐方式 */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  /** flex 容器在交叉轴方向上的对齐方式 */
  items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /** 获得最大宽度或者高度 flex-grow: 1 */
  grow?: boolean
  /** 防止被挤压 flex-shrink: 0 */
  shrink?: boolean
  /** 单个元素在交叉轴方向上的对齐方式 */
  self?: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch'
}

export const Space: React.FC<SpaceProps>
