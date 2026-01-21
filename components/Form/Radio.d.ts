import { ReactElement, FC } from 'react'
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
   * 是否多选
   * 开启后 value/onChange/defaultValue 将变成数组结构
   */
  multiple?: boolean
  /**
   * 是否垂直布局
   */
  vertical?: boolean
  /**
   * 虚拟节点
   */
  virtual?: boolean
  /**
   * 允许取消选择
   */
  cancel?: boolean
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

interface RadioProps extends SpaceProps {
  /**
   * 当前选项的值
   */
  value: any
  /**
   * 当前选项的标签文字
   */
  label?: string | ReactElement
  /**
   * 如果单独使用 Radio 可以用这个属性控制是否选中
   */
  checked?: boolean
  /**
   * 是否禁用这个选项
   */
  disabled?: boolean
  /**
   * 主题色
   * @default primary
   */
  type?: keyof type
}

export const Radio: FC<RadioProps>

export const RadioGroup: FC<
  | (RadioGroupProps & {
    multiple?: false
    value: any
    onChange?: (value: any) => void
    defaultValue?: any
  })
  | (Omit<RadioGroupProps, 'value' | 'onChange' | 'defaultValue'> & {
    multiple: true
    value: any[]
    onChange?: (value: any[]) => void
    defaultValue?: any[]
  })
>
