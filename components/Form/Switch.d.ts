import { SwitchProps as TaroSwitchProps } from '@tarojs/components'

interface SwitchProps extends TaroSwitchProps {
  /**
   * 值变化回调函数
   */
  onChange?: (boolean: string) => void
  /**
   * 输入框的值
   */
  value?: boolean
}

export const Switch: React.FC<SwitchProps>
