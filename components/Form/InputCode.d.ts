import { ReactNode, CSSProperties } from 'react'

interface InputCodeProps {
  /** 组件值 */
  value?: string,
  /** 值改变回调 此功能待实现 */
  onChange?: (value: string | number) => void
  /** 按键点击事件 */
  onClick: () => void
  /** 输入长度 默认6 */
  length?: number
  /** 是否隐藏输入内容 */
  password?: boolean
  /** 是否显示焦点 */
  focus?: boolean
  /** 每个输入框的样式 */
  itemStyle?: CSSProperties
  /** 类名 */
  className?: string
  /** 样式 */
  style?: CSSProperties
}

export const InputCode: React.FC<InputCodeProps>