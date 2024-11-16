import { createContext, useCallback, useContext } from 'react'
import { noop, stopPropagation } from '@/duxapp/utils'
import classNames from 'classnames'
import { Space } from '../Space'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'
import { Form } from './Form'

const context = createContext({ check: noop })

const CheckboxGroup = ({
  children,
  value = [],
  defaultValue,
  onChange,
  disabled,
  direction = 'horizontal',
  vertical,
  style,
  className,
  virtual,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({
    onChange,
    value,
    defaultValue
  })

  const horizontal = direction === 'horizontal' && !vertical

  const check = useCallback(_val => {
    if (disabled) {
      return
    }

    setVal(old => {
      const select = old ? [...old] : []
      const index = select.indexOf(_val)
      if (~index) {
        select.splice(index, 1)
      } else {
        select.push(_val)
      }
      return select
    })
  }, [setVal, disabled])

  return <context.Provider value={{ check, currentValue: val }}>
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

export const Checkbox = ({
  value, label, checked, half,
  disabled, children: Child,
  style, ...props
}) => {
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

  return <Space
    row items='center' size={8}
    onClick={e => {
      if (!disabled) {
        stopPropagation(e)
        check(value)
      }
    }}
    style={style}  {...props}
  >
    {/* <Text size={6} type={isCheck || half ? 'primary' : void 0} color={isCheck || half ? void 0 : 3}>
      <DuxuiIcon name={isCheck ? 'xuanzhong' : half ? 'banxuanze' : 'xuanzekuang'} />
    </Text> */}
    <DuxuiIcon
      className={classNames('text-s6',isCheck || half ? 'text-primary' : 'text-c3')}
      name={isCheck ? 'xuanzhong' : half ? 'banxuanze' : 'xuanzekuang'}
    />
    {!!label && <Text>{label}</Text>}
  </Space>
}

Checkbox.Group = CheckboxGroup
