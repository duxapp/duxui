import { InputProps as TaroInputProps } from '@tarojs/components'
import { ReactNode } from 'react'

type Align = 'left' | 'center' | 'right'

type Self = 'start' | 'end' | 'center' | 'baseline' | 'stretch'

interface InputProps extends TaroInputProps {
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
   * 值变化回调函数
   */
  onChange?: (value: string) => void
  /**
   * 默认值
   */
  defaultValue?: string
}

interface InputSearchProps extends InputProps {

}

export const Input: React.FC<InputProps> & {
  Search: React.FC<InputSearchProps>
}
