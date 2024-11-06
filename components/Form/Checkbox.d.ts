import { ReactNode, FC } from 'react'
import { SpaceProps } from '../Space'

interface CheckboxGroupProps extends SpaceProps {
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
   * 禁用选择
   */
  disabled?: boolean
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
   * 半选中状态
   * checked为假的时候生效
   */
  half?: boolean
  /**
   * 禁用这个选项
   */
  disabled?: boolean
}

export const Checkbox: FC<CheckboxProps> & {
  Group: FC<CheckboxGroupProps>
}
