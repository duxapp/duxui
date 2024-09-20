import { ReactElement, CSSProperties } from 'react'
import { ColumnProps } from '../Flex'

interface CustomKey {
  /** 按键key 如果未指定 onClick 则会通过 onKeyPress 事件传递这个key */
  key: string
  /** 自定义渲染内容 */
  render?: ReactElement,
  /** 自定义点击事件 */
  onClick?: () => void
}

interface NumberKeyboardProps extends ColumnProps {
  /** 按键点击事件 */
  onKeyPress: (key: string) => void
  /** 删除键事件 */
  onBackspace?: () => void
  /** 打乱显示数字 */
  random?: boolean
  /** 底部左侧按钮自定义 */
  keyLeft?: CustomKey
  /** 底部右侧按钮自定义 此处默认为回退键 */
  keyRight?: CustomKey
}

export const NumberKeyboard: React.FC<NumberKeyboardProps> & {
  /**
   * 使用控制器 用于快速生成键盘输入的值
   * @returns
   */
  useController: (option?: {
    /** 默认值 */
    defaultValue?: string,
    /** 是否转换为数字 */
    number?: boolean
  }) => [
      staring | number,
      {
        onKeyPress: (key: string) => void,
        onBackspace: () => void
      }
    ]
}
