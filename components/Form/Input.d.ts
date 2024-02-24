import { InputProps as TaroInputProps } from '@tarojs/components'
import { CSSProperties, ReactNode } from 'react'

type Align = 'left' | 'center' | 'right'

type Self = 'start' | 'end' | 'center' | 'baseline' | 'stretch'

interface InputProps extends Omit<TaroInputProps, 'onInput' | 'value'> {
  /**
   * 是否自动增长宽度
   */
  grow?: boolean
  /**
   * 是否自动收缩宽度
   */
  shrink?: boolean
  /**
   * 自身对齐方式
   */
  self?: Self
  /**
   * 文本对齐方式
   */
  align?: Align
  /**
   * 自定义样式类名
   */
  className?: string
  /**
   * 自定义样式对象
   */
  style?: CSSProperties
  /**
   * 值变化回调函数
   */
  onChange?: (value: string) => void
  /**
   * 输入框的值
   */
  value?: string
}

export const Input: React.FC<InputProps>

interface InputSearchProps extends Omit<TaroInputProps, 'onInput' | 'value'> {
  /**
   * 输入框的值
   */
  value?: string
  /**
   * 值变化回调函数
   */
  onChange?: (value: string) => void
}

export const InputSearch: React.FC<InputSearchProps>
