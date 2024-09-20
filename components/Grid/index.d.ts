import { ViewProps } from '@tarojs/components'
import { ReactNode, CSSProperties } from 'react'

interface GridProps extends ViewProps {
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
  /** 每一个元素容器的样式 */
  itemStyle?: CSSProperties
}

export const Grid: React.FC<GridProps>
