import { createContext, useCallback, useContext } from 'react'
import { noop, stopPropagation } from '@/duxapp/utils'
import classNames from 'classnames'
import { Space } from '../Space'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'
import { useFormItemProxy } from './Form'
import { Row } from '../Flex'

const context = /*@__PURE__*/ createContext({ check: noop, type: 'primary' })

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
  className,
  onCheck,
  style,
  type: checkboxType,
  ...props
}) => {
  const { check, currentValue, type: groupType } = useContext(context)

  const themeType = checkboxType || groupType || 'primary'

  const click = val => {
    if (onCheck) {
      onCheck(!checked)
    } else {
      check(val)
    }
  }

  const isCheck = checked || currentValue?.includes(value)

  if (Child) {
    return <Child
      {...props}
      value={value}
      label={label}
      checked={isCheck}
      type={themeType}
      onCheck={() => !disabled && click(value)}
    />
  }

  const event = !disabled && (check !== noop || onCheck)

  return <Row
    className={classNames('gap-1 items-center', className)}
    {...event ? {
      onClick: e => {
        stopPropagation(e)
        click(value)
      }
    } : {}}
    style={style} {...props}
  >
    {/* <Text size={6} type={isCheck || half ? 'primary' : void 0} color={isCheck || half ? void 0 : 3}>
      <DuxuiIcon name={isCheck ? 'xuanzhong' : half ? 'banxuanze' : 'xuanzekuang'} />
    </Text> */}
    <DuxuiIcon
      className={classNames('text-s6', isCheck || half ? `text-${themeType}` : 'text-c3')}
      name={isCheck ? 'xuanzhong' : half ? 'banxuanze' : 'xuanzekuang'}
    />
    {!!label && <Text>{label}</Text>}
  </Row>
}

export const CheckboxGroup = ({
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
  max,
  type = 'primary',
  ...props
}) => {

  const [val, setVal] = useFormItemProxy({
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
        if (max && select.length >= max) {
          return old
        }
        select.push(_val)
      }
      return select
    })
  }, [disabled, setVal, max])

  return <context.Provider value={{ check, currentValue: val, type }}>
    {
      virtual ?
        children :
        <Space row={horizontal} items={horizontal ? 'center' : 'stretch'} wrap={horizontal} {...props} style={style} className={classNames('flex-grow', className)}>
          {children}
        </Space>
    }
  </context.Provider>
}
