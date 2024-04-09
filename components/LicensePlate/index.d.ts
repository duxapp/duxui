import { Context, ReactNode } from 'react'
import { InputCodeProps } from '../Form'

interface LicensePlateProps {
  /** 车牌长度 默认7 新能源为8 */
  length?: number
  /** 输入回调 */
  onChange?: (value: string) => void
}

interface KeyboardProps {
  /** 输入事件 */
  onInput?: (key: string) => void
  /** 删除事件 */
  onBackspace?: () => void
}

interface InputProps extends InputCodeProps {
  /** 车牌长度 默认7 新能源为8 */
  length?: number
}

interface ProviderProps {
  /** 子元素 */
  children?: number
}

/**
 * 车牌号码键盘输入
 */
export const LicensePlate: React.FC<LicensePlateProps> & {
  Keyboard: React.FC<KeyboardProps>
  Input: React.FC<InputProps>
  Provider: React.FC<ProviderProps>
  context: Context
}
