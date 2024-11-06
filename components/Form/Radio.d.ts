import { ReactElement, FC } from 'react'
import { SpaceProps } from '../Space'

interface RadioGroupProps extends SpaceProps {
  /**
   * 当前选中的值
   */
  value: any
  /**
   * 值改变时的回调函数
   */
  onChange?: (value: any) => void
  /**
   * 默认值
   */
  defaultValue?: any
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

interface RadioProps extends SpaceProps {
  /**
   * 当前选项的值
   */
  value: any
  /**
   * 当前选项的标签文字
   */
  label?: ReactElement
  /**
   * 如果单独使用 Radio 可以用这个属性控制是否选中
   */
  checked?: boolean
  /**
   * 是否禁用这个选项
   */
  disabled?: boolean
}

export const Radio: FC<RadioProps> & {
  Group: FC<RadioGroupProps>
}
