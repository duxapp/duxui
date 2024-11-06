import { SwitchProps as TaroSwitchProps } from '@tarojs/components'

interface SwitchProps extends TaroSwitchProps {
  /**
   * 值变化回调函数
   */
  onChange?: (value: boolean | any) => void
  /**
   * 默认值
   */
  defaultValue?: boolean | any
  /**
   * 指定未选中和选中的值
   */
  values?: [any, any]
  /**
   * 值
   */
  value?: boolean
}

export const Switch: React.FC<SwitchProps>
