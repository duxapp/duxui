import { duxappTheme } from '@/duxapp'
import { Switch as TaroSwitch } from '@tarojs/components'

export const Switch = ({ onChange, value, ...props }) => {

  return <TaroSwitch
    onChange={e => onChange?.(e.detail.value)}
    color={duxappTheme.primaryColor}
    checked={value}
    {...props}
  />
}
