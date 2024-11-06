import { CSSProperties } from 'react'
import { RowProps } from '../Flex'

interface InputCodeProps extends RowProps {
  /** 组件值 */
  value?: string,
  /** 值改变回调 此功能待实现 */
  onChange?: (value: string) => void
  /** 默认值 */
  defaultValue?: string
  /** 输入长度 默认6 */
  length?: number
  /** 是否隐藏输入内容 */
  password?: boolean
  /** 是否显示焦点 */
  focus?: boolean
  /** 每个输入框的样式 */
  itemStyle?: CSSProperties
}

export const InputCode: React.FC<InputCodeProps>
