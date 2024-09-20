import { createContext, useCallback, useContext } from 'react'
import { noop } from '@/duxapp/utils'
import classNames from 'classnames'
import { Space } from '../Space'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'

const context = createContext({ check: noop })

const CheckboxGroup = ({
  children,
  value = [],
  onChange,
  disabled,
  direction = 'horizontal',
  vertical,
  style,
  className,
  virtual,
  ...props
}) => {

  const horizontal = direction === 'horizontal' && !vertical

  const check = useCallback(val => {
    if (disabled) {
      return
    }
    const _value = value ? [...value] : []
    const index = _value.indexOf(val)
    if (~index) {
      _value.splice(index, 1)
    } else {
      _value.push(val)
    }
    onChange?.(_value)
  }, [onChange, value, disabled])

  return <context.Provider value={{ check, currentValue: value }}>
    {
      virtual ?
        children :
        <Space row={horizontal} items={horizontal ? 'center' : 'stretch'} wrap={horizontal} {...props} style={style} className={classNames('flex-grow', className)}>
          {children}
        </Space>
    }
  </context.Provider>
}

/**
 * 用于计算出选中的内容显示值
 * @param {*} value 当前值
 * @param {*} param1 传入组件的参数
 * @returns
 */
// CheckboxGroup.getShowText = (value, props) => {
//   console.log('12323',value, props)
// }

export const Checkbox = ({ value, label, checked, disabled, children: Child, className, style, ...props }) => {
  const { check, currentValue } = useContext(context)

  const isCheck = checked || currentValue?.includes(value)

  if (Child) {
    return <Child
      {...props}
      value={value}
      label={label}
      checked={isCheck}
      onCheck={() => !disabled && check(value)}
    />
  }

  return <Space row items='center' size={8} onClick={() => !disabled && check(value)} className={className} style={style}  {...props}>
    <Text size={32} type={isCheck ? 'primary' : void 0} color={isCheck ? void 0 : 3}>
      <DuxuiIcon name={isCheck ? 'xuanzhong' : 'xuanzekuang'} />
    </Text>
    {!!label && <Text>{label}</Text>}
  </Space>
}

Checkbox.Group = CheckboxGroup
