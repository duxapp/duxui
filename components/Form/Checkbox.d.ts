import { ReactNode, FC } from 'react'
import { RowProps } from '../Flex'
import { SpaceProps } from '../Space'

interface type {
  /** 主色 */
  primary
  /** 辅色 */
  secondary
  /** 成功 */
  success
  /** 错误 */
  danger
  /** 警告 */
  warning
  /** 自定义1 */
  custom1
  /** 自定义2 */
  custom2
  /** 自定义3 */
  custom3
}

interface CheckboxGroupProps extends RowProps {
  /**
   * 当前选中的值
   */
  value?: any[]
  /**
   * 值改变时的回调函数
   */
  onChange?: (value: any[]) => void
  /**
   * 默认值
   */
  defaultValue?: any[]
  /**
   * 是否垂直布局
   */
  vertical?: boolean
  /**
   * 虚拟节点
   */
  virtual?: boolean
  /**
   * 最多允许选中的选项数量
   */
  max?: number
  /**
   * 禁用选择
   */
  disabled?: boolean
  /**
   * 主题色
   * @default primary
   */
  type?: keyof type
}

interface CheckboxProps extends SpaceProps {
  /**
   * 复选框的值
   */
  value: any
  /**
   * 复选框的标签文字
   */
  label?: ReactNode
  /**
   * 复选框是否被选中
   */
  checked?: boolean
  /**
   * 作为单个组件使用
   */
  onCheck?: (checked: boolean) => void
  /**
   * 半选中状态
   * checked为假的时候生效
   */
  half?: boolean
  /**
   * 禁用这个选项
   */
  disabled?: boolean
  /**
   * 主题色
   * @default primary
   */
  type?: keyof type
}

export const Checkbox: FC<CheckboxProps>

export const CheckboxGroup: FC<CheckboxGroupProps>
