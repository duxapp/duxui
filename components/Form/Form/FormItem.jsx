import { isValidElement, cloneElement, useEffect, useMemo, useCallback, useRef, Children } from 'react'
import classNames from 'classnames'
import { Text } from '../../Text'
import { Column } from '../../Flex'
import { Space } from '../../Space'
import { useFormContext } from './Form'
import './FormItem.scss'

export const FormItem = ({
  label,
  labelProps,
  containerProps,
  subLabel,
  renderLabelRight,
  desc,
  direction,
  vertical,
  required,
  initialValue,
  style,
  disabled,
  className,
  children,
  rules,
  trigger = 'onChange',
  triggerPropName = 'value',
  name,
  field = name,
  wholeForm,
  fields = wholeForm,
  form: findForm,
  ...props
}) => {

  const form = useFormContext()

  const fieldOld = useRef(null)

  const addTask = useMemo(() => {
    return rules?.length && form.addItem({
      field,
      rules
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  useEffect(() => {
    return () => addTask?.remove?.()
  }, [addTask])

  useMemo(() => {
    form.onGetField?.(field, fieldOld.current)
    fieldOld.current = field
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  const horizontal = (direction || form.direction) === 'horizontal' && !vertical && (!form.vertical || vertical === false)

  const _labelProps = { ...form.labelProps, ...labelProps }

  const _containerProps = { ...form.containerProps, ...containerProps }

  const value = form.values[field]

  let child = children
  if (typeof children === 'function') {
    child = children({
      value,
      ...form
    })
  }

  // 缓存子元素的值更改函数
  const triggerEventRef = useRef()

  const { setValues, setValue, itemPadding } = form

  const change = useCallback(val => {
    triggerEventRef.current?.(val)
    if (fields) {
      setValues(val)
    } else {
      // 兼容Taro原生组件
      if (val && typeof val === 'object' && typeof val.detail?.value !== 'undefined') {
        val = val.detail.value
      }
      setValue(field, val)
    }
  }, [fields, setValues, setValue, field])

  const cloneForm = item => {
    triggerEventRef.current = item.props[trigger]
    return cloneElement(item, {
      [trigger]: change,
      field: item.props.field || field,
      [triggerPropName]: item[triggerPropName] ?? (fields ? form.values : value),
      disabled: disabled ?? form.disabled
    })
  }

  const findFormItem = eles => {
    let find
    const res = Children.map(eles, (item => {
      if (!find && isValidElement(item) && item.type === findForm) {
        find = true
        return cloneForm(item)
      } else if (!find && isValidElement(item) && item.props.children) {
        const childRes = findFormItem(item.props.children)
        if (childRes.find) {
          find = true
          return cloneElement(item, {
            children: childRes.child
          })
        } else {
          return item
        }
      }
      return item
    }))
    return {
      find,
      child: res
    }
  }

  if (typeof field !== 'undefined' || fields) {
    if (findForm) {
      child = findFormItem(child).child
    } else if (isValidElement(child)) {
      child = cloneForm(child)
    }
  }

  if (typeof label === 'undefined') {
    return child
  }

  const err = form.validateErrors?.[field]

  const footer = <>
    {!!desc && <Text size={2} color={2}>{desc}</Text>}
    {err && <Text type='danger' size={1}>{err.message}</Text>}
  </>

  if (!label) {
    return <Column {...props} style={style} className={classNames('FormItem', !itemPadding && 'FormItem--no-padding', className)}>
      {child}
      {footer}
    </Column>
  }

  const _label = <Text
    {..._labelProps}
    className={classNames(horizontal && 'FormItem__label', _labelProps.className)}
    style={_labelProps.style}
  >
    {label}{required && <Text className='FormItem__label__required'>*</Text>}
    {!!subLabel && <Text size={1} color={3} bold={false}> {subLabel}</Text>}
  </Text>

  return <Column {...props} style={style} className={classNames('FormItem', !itemPadding && 'FormItem--no-padding', className)}>
    <Space row={horizontal} items={horizontal ? 'center' : 'stretch'} style={_containerProps.style} {..._containerProps} >
      {
        renderLabelRight ? <Space row justify='between'>
          {_label}
          {renderLabelRight}
        </Space>
          : _label
      }
      {child}
    </Space>
    {footer}
  </Column>
}
