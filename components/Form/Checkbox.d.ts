import { ReactNode, CSSProperties, FC } from 'react'

type Direction = 'horizontal' | 'vertical'

interface CheckboxGroupProps {
  /**
   * 复选框组件
   */
  children: ReactNode
  /**
   * 当前选中的值
   */
  value?: any[]
  /**
   * 值改变时的回调函数
   */
  onChange?: (value: any[]) => void
  /**
   * 是否垂直布局
   */
  vertical?: boolean
  /**
   * 附加在复选框组容器上的 CSS 类名
   */
  className?: string
  /**
   * 虚拟节点
   */
  virtual?: boolean
  /**
   * 附加在复选框组容器上的样式
   */
  style?: CSSProperties
  /**
   * 禁用选项
   */
  disabled?: boolean
  /**
   * 其他属性
   */
  [key: string]: any
}

interface CheckboxProps {
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
   * 附加在复选框容器上的 CSS 类名
   */
  className?: string
  /**
   * 其他属性
   */
  [key: string]: any
}

interface CheckboxContextValue {
  /**
   * 复选框选择函数
   */
  check: (value: any) => void
  /**
   * 当前选中的值
   */
  currentValue: any[]
}

export const Checkbox: FC<CheckboxProps> & {
  Group: FC<CheckboxGroupProps>
}
