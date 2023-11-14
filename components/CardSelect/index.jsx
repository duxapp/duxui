import { View } from '@tarojs/components'
import classNames from 'classnames'
import { colorLighten } from '@/duxapp'
import React, { Children, cloneElement, createContext, useCallback, useContext, useMemo } from 'react'
import { duxuiTheme } from '@/duxui/utils'
import './index.scss'

const context = createContext({
  isCheck: value => false,
  check: value => void 0
})

const CardSelectGroup = ({
  value,
  onChange,
  checkbox,
  children,
  checkedProps,
  ...props
}) => {

  const isCheck = useCallback(val => checkbox ? value?.includes?.(val) : value === val, [checkbox, value])

  const check = useCallback(val => {
    if (checkbox) {
      const _value = value instanceof Array ? [...value] : []
      const index = _value.indexOf(val)
      if (~index) {
        _value.splice(index, 1)
      } else {
        _value.push(val)
      }
      onChange?.(_value)
    } else {
      onChange?.(val)
    }
  }, [checkbox, onChange, value])

  return <context.Provider value={{ isCheck, check, checkedProps }}>
    {React.isValidElement(children) ? React.cloneElement(children, props) : children}
  </context.Provider>
}

export const CardSelect = ({
  color = duxuiTheme.cardSelect.color,
  value,
  checked,
  plain,
  border = plain ? true : false,
  borderColor = color,
  disabled,
  disabledCheck,
  radiusType = duxuiTheme.cardSelect.radiusType,
  className,
  children,
  onClick,
  style,
  ...props
}) => {

  const { isCheck, check, checkedProps } = useContext(context)

  const select = checked || isCheck(value)

  const [viewStyle, textStyle] = useMemo(() => {
    const _color = select && checkedProps?.color ? checkedProps?.color : color
    const _borderColor = select ? (checkedProps?.borderColor || checkedProps?.color || borderColor) : borderColor
    const _plain = select && checkedProps?.plain !== undefined ? checkedProps?.plain : select ? false : plain
    const _border = select && checkedProps?.border !== undefined ? checkedProps?.border : border

    const styles = [{}, {}]
    if (_plain) {
      styles[0].backgroundColor = colorLighten(_color, 0.8)
    } else if (select) {
      styles[0].backgroundColor = _color
    }
    if (_border) {
      styles[0].borderWidth = 1
      styles[0].borderColor = _borderColor
    }
    styles[1].color = !select || _plain ? _color : '#fff'
    return styles
  }, [border, borderColor, checkedProps?.border, checkedProps?.borderColor, checkedProps?.color, checkedProps?.plain, color, plain, select])

  const click = useCallback(e => {
    onClick?.(e)
    if (disabled || disabledCheck) {
      return
    }
    check(value)
  }, [check, disabled, disabledCheck, onClick, value])

  return <View
    className={classNames(
      'CardSelect',
      'CardSelect--' + radiusType,
      disabled && 'CardSelect--disable',
      className
    )}
    onClick={click}
    style={{ ...viewStyle, ...style }}
    {...props}
  >
    {
      Children.map(children, child => cloneElement(child, { style: { ...textStyle, ...child.props.style } }))
    }
  </View>
}

CardSelect.Group = CardSelectGroup
