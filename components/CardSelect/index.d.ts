import { ReactNode } from 'react'
import { StandardProps } from '@tarojs/components/types/common'

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
    /** 是否实心 */
    plain?: boolean
    /** 是否有边框 */
    border?: boolean
    /** 边框颜色 */
    borderColor?: string
  }
  /** 子元素 */
  children: ReactNode
}

interface CardSelectProps extends StandardProps {
  /** 选中的值 */
  value?: string | number
  /** 是否选中 */
  checked?: boolean
  /** 是否实心 */
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
  /** 点击事件 */
  onClick?: (event: any) => void
  /** 子元素 */
  children?: ReactNode
}

export const Card: React.FC<CardSelect> & {
  Group: React.FC<CardSelectGroupProps>
}
