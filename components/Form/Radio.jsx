import { createContext, useCallback, useContext } from 'react'
import { noop } from '@/duxapp/utils'
import classNames from 'classnames'
import { Space } from '../Space'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'
import { useFormItemProxy } from './Form'
import { Row } from '../Flex'

const context = /*@__PURE__*/ createContext({ check: noop })

export const Radio = ({ value, label, disabled, checked, onClick, children: Child, style, className, ...props }) => {
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

  return <Row
    className={classNames('gap-1 items-center', className)}
    onClick={e => {
      if (disabled) {
        return
      }
      check(value)
      onClick?.(e)
    }}
    style={style}
    {...props}
  >
    <DuxuiIcon
      className={_checked ? 'text-primary' : 'text-c3'}
      size={42}
      name={_checked ? 'roundcheckfill' : 'roundcheck'}
    />
    {!!label && <Text>{label}</Text>}
  </Row>
}

export const RadioGroup = ({
  children,
  value,
  onChange,
  defaultValue,
  disabled,
  direction = 'horizontal',
  vertical,
  cancel,
  style,
  virtual,
  className,
  ...props
}) => {

  const [val, setVal] = useFormItemProxy({ value, onChange, defaultValue })

  const horizontal = direction === 'horizontal' && !vertical

  const check = useCallback(_val => {
    if (disabled) {
      return
    }
    if (val === _val && cancel) {
      setVal()
    } else if (val !== _val) {
      setVal(_val)
    }
  }, [val, cancel, disabled, setVal])

  return <context.Provider value={{ check, currentValue: val }}>
    {
      virtual ?
        children :
        <Space row={horizontal}
          items={horizontal ? 'center' : 'stretch'}
          wrap={horizontal}
          style={style}
          {...props}
          className={classNames('flex-grow', className)}
        >
          {children}
        </Space>
    }
  </context.Provider>
}
