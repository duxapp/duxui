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
  className,
  style,
  virtual,
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
    {
      virtual ?
        children :
        <Space row={horizontal} items={horizontal ? 'center' : 'stretch'} wrap={horizontal} style={style} {...props} className={className}>
          {children}
        </Space>
    }
  </context.Provider>
}

export const Radio = ({ value, label, checked, onClick, children: Child, className, style, ...props }) => {
  const { check, currentValue } = useContext(context)

  const _checked = typeof checked === 'boolean' ? checked : currentValue === value

  if (Child) {
    return <Child
      {...props}
      value={value}
      label={label}
      checked={_checked}
      onCheck={() => check(value)}
    />
  }

  return <Space row items='center' size={8}
    onClick={e => {
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
