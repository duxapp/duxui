import { createContext, useCallback, useContext } from 'react'
import { noop } from '@/duxapp/utils'
import { Space } from '../Space'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'

const context = createContext({ check: noop })

const RadioGroup = ({
  children,
  value,
  onChange,
  disabled,
  direction = 'horizontal',
  ...props
}) => {

  const horizontal = direction === 'horizontal'

  const check = useCallback(val => {
    if (value === val || disabled) {
      return
    }
    onChange?.(val)
  }, [onChange, value, disabled])

  return <context.Provider value={{ check, currentValue: value }}>
    <Space row={horizontal} items={horizontal ? 'center' : 'stretch'} wrap={horizontal} {...props} className='flex-grow'>
      {children}
    </Space>
  </context.Provider>
}

export const Radio = ({ value, label, children: Child, ...props }) => {
  const { check, currentValue } = useContext(context)

  if (Child) {
    return <Child
      {...props}
      value={value}
      label={label}
      checked={currentValue === value}
      onCheck={() => check(value)}
    />
  }

  return <Space row items='center' size={8} onClick={() => check(value)} {...props}>
    <Text size={42} type={currentValue === value ? 'primary' : void 0} color={currentValue === value ? void 0 : 3}>
      <DuxuiIcon name={currentValue === value ? 'add_check1' : 'option'} />
    </Text>
    {!!label && <Text>{label}</Text>}
  </Space>
}

Radio.Group = RadioGroup
