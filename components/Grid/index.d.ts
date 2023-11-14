import { StandardProps } from '@tarojs/components/types/common'
import { ReactNode, CSSProperties } from 'react'

interface GridProps extends StandardProps {
  /** 列数 */
  column?: number
  /** 是否为正方形 */
  square?: boolean
  /** 单元格之间的间距 */
  gap?: number
  /** 行间距 默认等于gap */
  rowGap?: number
  /** 列间距 默认等于gap */
  columnGap?: number
  /** 子元素 */
  children?: ReactNode
  /** 每一个元素容器的样式 */
  itemStyle?: CSSProperties
}

export const Grid: React.FC<GridProps>
