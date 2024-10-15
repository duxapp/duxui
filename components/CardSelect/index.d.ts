import { ReactNode } from 'react'
import { ViewProps } from '@tarojs/components'

interface CardSelectGroupProps {
  /** 选中的值 */
  value?: string | number | (string | number)[]
  /** 值变化回调 */
  onChange?: (value: string | number | (string | number)[]) => void
  /** 是否多选 */
  checkbox?: boolean
  /** 选中样式 */
  checkedProps?: {
    /** 选中时背景颜色 */
    color?: string
    /** 是否镂空 */
    plain?: boolean
    /** 是否有边框 */
    border?: boolean
    /** 边框颜色 */
    borderColor?: string
  }
  /** 子元素 */
  children: ReactNode
}

interface CardSelectProps extends ViewProps {
  /** 当前选项的值 */
  value: string | number
  /** 是否选中 */
  checked?: boolean
  /** 是否镂空 */
  plain?: boolean
  /** 颜色 */
  color?: string
  /** 是否有边框 */
  border?: boolean
  /** 边框颜色 */
  borderColor?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 仅禁用选中，样式不是禁用样式 */
  disabledCheck?: boolean
  /** 圆角类型 */
  radiusType?: 'square' | 'round' | 'round-min'
}

export const CardSelect: React.FC<CardSelectProps> & {
  Group: React.FC<CardSelectGroupProps>
}
