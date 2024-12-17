import { ReactElement } from 'react'
import { ViewProps } from '@tarojs/components'

interface ProgressCircleProps extends ViewProps {
  /**
   * 值 0 - 100
   */
  value: number
  /**
   * 尺寸 默认 200
   */
  size?: number
  /**
   * 圆弧的宽度
   * 默认 20
   */
  strokeWidth?: number
  /**
   * 进度条颜色
   * 默认为 duxappTheme.primaryColor
   */
  color?: string | {
    [key: string]: string
  }
  /**
   * 进度条背景颜色
   * 默认为 #e5e9f2
   */
  background?: string
  /**
   * 进度条端点形状
   * 默认为 round
   */
  strokeLinecap?: 'round' | 'square'
  /**
   * 是否顺时针展示
   * 默认为 true
   */
  clockwise?: boolean
  /**
   * 加载中状态
   */
  loading?: boolean
}


export const ProgressCircle: React.FC<ProgressCircleProps>
