import { TextareaProps as TaroTextareaProps } from '@tarojs/components'

type Align = 'left' | 'center' | 'right'

type Self = 'start' | 'end' | 'center' | 'baseline' | 'stretch'

interface TextareaProps extends TaroTextareaProps {
  /**
   * 显示几行 用于控制高度
   */
  line?: number
  /**
   * 最多允许输入数字
   */
  maxlength?: number
  /**
   * 是否显示输入文字长度 默认 开启
   * 在设置maxlength的时候生效
   */
  showLength?: boolean
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
}

export const Textarea: React.FC<TextareaProps>
