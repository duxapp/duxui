import { isValidElement, cloneElement, useEffect, useMemo, useCallback, useRef, Children, useState } from 'react'
import classNames from 'classnames'
import { nextTick } from '@/duxapp'
import { Schema } from 'b-validate'
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
  hidden,
  number,
  ...props
}) => {

  const form = useFormContext()

  const value = form.values[field]

  const [checkError, setError] = useState()

  const refs = useRef({}).current

  refs.form = form
  refs.value = value
  refs.checkError = checkError

  let show = !hidden
  if (hidden) {
    if (typeof hidden === 'function') {
      show = !hidden(form.values)
    }
  }

  const check = useCallback(() => {
    const schema = new Schema({
      [field]: rules
    })
    return new Promise((resolve, reject) => {
      schema.validate({ [field]: fields ? refs.form.values : refs.value }, errors => {
        if (!errors) {
          resolve()
        } else {
          reject(errors[field])
          setError(errors[field])
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, fields])

  useEffect(() => {
    if (rules?.length && show) {
      const { remove } = refs.form.addRules(check)
      return () => remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [check])

  useMemo(() => {
    if (!show) {
      return
    }
    refs.form.onGetField?.(field, refs.fieldOld)
    refs.fieldOld = field
  }, [field, refs, show])

  const horizontal = (direction || form.direction) === 'horizontal' && !vertical && (!form.vertical || vertical === false)

  const _labelProps = { ...form.labelProps, ...labelProps }

  const _containerProps = { ...form.containerProps, ...containerProps }

  let child = children
  if (typeof children === 'function') {
    child = children({
      value,
      ...form
    })
  }

  const change = useCallback(val => {
    refs.triggerEvent?.(val)

    // 用户输入检查错误是否在存在
    if (refs.checkError) {
      nextTick(() => {
        check().then(() => {
          setError(null)
        }).catch(err => {
          console.log(err)
        })
      })
    }

    if (fields) {
      refs.form.setValues(val)
    } else {
      // 兼容Taro原生组件
      if (val && typeof val === 'object' && typeof val.detail?.value !== 'undefined') {
        val = val.detail.value
      }
      refs.form.setValue(field, number ? +val : val)
    }
  }, [refs, fields, check, field, number])

  if (!show) {
    return
  }

  const cloneForm = item => {
    // 缓存子元素的值更改函数
    refs.triggerEvent = item.props[trigger]
    return cloneElement(item, {
      [trigger]: change,
      field: item.props.field || field,
      [triggerPropName]: item[triggerPropName] ?? (fields ? form.values : value),
      disabled: item.props.disabled ?? disabled ?? form.disabled
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
    } else if (isValidElement(child) && child.type !== FormItem) {
      child = cloneForm(child)
    }
  }

  if (typeof label === 'undefined') {
    return child
  }

  const footer = <>
    {!!desc && <Text size={2} color={2}>{desc}</Text>}
    {checkError && <Text type='danger' size={1}>{checkError.message}</Text>}
  </>

  if (!label) {
    return <Column {...props} style={style} className={classNames('FormItem', !form.itemPadding && 'FormItem--no-padding', className)}>
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

  return <Column {...props} style={style} className={classNames('FormItem', !form.itemPadding && 'FormItem--no-padding', className)}>
    <Space row={horizontal} items={horizontal ? 'center' : 'stretch'} style={_containerProps.style} {..._containerProps} >
      {
        renderLabelRight ? <Space row justify='between'>
          {_label}
          {isValidElement(renderLabelRight) ?
            cloneElement(renderLabelRight, {
              value: renderLabelRight.props.value ?? (fields ? form.values : value),
              onChange: renderLabelRight.props.onChange ?? change,
              disabled: renderLabelRight.props.disabled ?? disabled ?? form.disabled
            }) :
            renderLabelRight
          }
        </Space>
          : _label
      }
      {child}
    </Space>
    {footer}
  </Column>
}
