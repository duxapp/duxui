import { createContext, useCallback, useContext } from 'react'
import { noop } from '@/duxapp/utils'
import { Space } from '../Space'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'
import { Form } from './Form'

const context = createContext({ check: noop })

const RadioGroup = ({
  children,
  value,
  onChange,
  defaultValue,
  disabled,
  direction = 'horizontal',
  vertical,
  className,
  style,
  virtual,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({ value, onChange, defaultValue })

  const horizontal = direction === 'horizontal' && !vertical

  const check = useCallback(_val => {
    if (val === _val || disabled) {
      return
    }
    setVal(_val)
  }, [setVal, val, disabled])

  return <context.Provider value={{ check, currentValue: val }}>
    {
      virtual ?
        children :
        <Space row={horizontal} items={horizontal ? 'center' : 'stretch'} wrap={horizontal} style={style} {...props} className={className}>
          {children}
        </Space>
    }
  </context.Provider>
}

export const Radio = ({ value, label, disabled, checked, onClick, children: Child, className, style, ...props }) => {
  const { check, currentValue } = useContext(context)

  const _checked = typeof checked === 'boolean' ? checked : currentValue === value

  if (Child) {
    return <Child
      {...props}
      value={value}
      label={label}
      checked={_checked}
      onCheck={() => !disabled && check(value)}
    />
  }

  return <Space row items='center' size={8}
    onClick={e => {
      if (disabled) {
        return
      }
      check(value)
      onClick?.(e)
    }}
    className={className}
    style={style}
    {...props}
  >
    <Text size={42} type={_checked ? 'primary' : void 0} color={_checked ? void 0 : 3}>
      <DuxuiIcon name={_checked ? 'roundcheckfill' : 'roundcheck'} />
    </Text>
    {!!label && <Text>{label}</Text>}
  </Space>
}

Radio.Group = RadioGroup
