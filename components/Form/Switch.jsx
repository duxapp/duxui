import { duxappTheme } from '@/duxapp'
import { Switch as TaroSwitch } from '@tarojs/components'
import { Form } from './Form'

export const Switch = ({ onChange, value, values, defaultValue, ...props }) => {

  const [val, setValue] = Form.useFormItemProxy({ value, onChange, defaultValue })

  return <TaroSwitch
    onChange={e => setValue(values ? values[e.detail.value ? 1 : 0] : e.detail.value)}
    color={duxappTheme.primaryColor}
    checked={values ? values[1] === val : !!val}
    {...props}
  />
}
