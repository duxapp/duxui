import { Context, ReactNode } from 'react'
import { InputCodeProps } from '../Form'

interface LicensePlateProps {
  /** 车牌长度 默认7 新能源为8 */
  length?: number
  /** 输入回调 */
  onChange?: (value: string) => void
}

interface LicensePlateKeyboardProps {
  /** 输入事件 */
  onInput?: (key: string) => void
  /** 删除事件 */
  onBackspace?: () => void
}

interface LicensePlateInputProps extends InputCodeProps {
  /** 车牌长度 默认7 新能源为8 默认7 */
  length?: number
}

interface LicensePlateProviderProps {
  /** 子元素 */
  children?: number
}

/**
 * 车牌号码键盘输入
 */
export const LicensePlate: React.FC<LicensePlateProps>

export const LicensePlateKeyboard: React.FC<LicensePlateKeyboardProps>
export const LicensePlateInput: React.FC<LicensePlateInputProps>
export const LicensePlateProvider: React.FC<LicensePlateProviderProps>
export const LicensePlateContext: Context
