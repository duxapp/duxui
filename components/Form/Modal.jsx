import { deepCopy, noop, PullView } from '@/duxapp'
import { cloneElement, useMemo, isValidElement, useCallback, createContext, useContext, useState, useRef } from 'react'
import classNames from 'classnames'
import { Button } from '../Button'
import { Row, Column } from '../Flex'
import { DuxuiIcon } from '../DuxuiIcon'
import { Text } from '../Text'
import { Divider } from '../Divider'
import { Space } from '../Space'
import { useFormContext, formContext, Form } from './Form'
import './Modal.scss'

const context = createContext({
  reset: noop,
  submit: noop
})

export const ModalForm = ({
  value,
  onChange,
  defaultValue,
  getValue,
  disabled,
  side,
  children,
  renderForm,
  renderHeader,
  renderFooter,
  title,
  placeholder = '请选择',
  showButton = true,
  onSubmitBefore,
  autoSubmit,
  resetMode,
  childPropsValueKey,
  field,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({ value, onChange, defaultValue })

  const refs = useRef({})
  refs.current = { onSubmitBefore, onChange: setVal }

  const { defaultValues } = useFormContext()

  const [selfValue, setSelfValue] = useState(val)

  const [show, setShow] = useState()

  const [formKey, setFormKey] = useState(0)

  const reset = useCallback(mode => {
    if (mode === 'prev') {
      setSelfValue(val)
    } else if (mode === 'clear') {
      setSelfValue(undefined)
    } else {
      // default 重置到表单设置的默认值
      setSelfValue(defaultValues?.[field])
    }
    setFormKey(old => old + 1)
  }, [defaultValues, field, val])

  const submit = useCallback(async _val => {
    try {
      const task = refs.current.onSubmitBefore?.(_val ?? selfValue)
      if (task instanceof Promise) {
        await task
      }
      refs.current.onChange?.(_val ?? selfValue)
      setShow(false)
    } catch (error) {
      console.log('ModalForm:提交被阻止', error)
    }
  }, [selfValue])

  const showValue = useMemo(() => {
    if (getValue) {
      return getValue(val)
    }
    if (isValidElement(renderForm) && renderForm.type?.getShowText) {
      const res = renderForm.type.getShowText(val, renderForm?.props)
      if (res instanceof Array) {
        return res.join(' ')
      }
      return res
    }
    return val
  }, [getValue, val, renderForm])

  const child = useMemo(() => {
    if (isValidElement(children)) {
      return cloneElement(children, {
        ...props,
        [childPropsValueKey]: showValue,
        onClick: () => !disabled && setShow(old => !old)
      })
    }
    return <Row onClick={() => !disabled && setShow(old => !old)} items='center' justify='end' {...props}>
      {
        typeof val !== 'undefined' ?
          <Text>{showValue}</Text> :
          <Text color={3}>{placeholder}</Text>
      }
      <Text color={3} size={5}><DuxuiIcon name='direction_right' /></Text>
    </Row>
  }, [childPropsValueKey, children, disabled, placeholder, props, showValue, val])

  const form = useMemo(() => {
    if (!renderForm) {
      console.error('renderForm为必传属性')
      return
    }
    if (isValidElement(renderForm)) {
      return cloneElement(renderForm, {
        key: formKey,
        value: selfValue,
        onChange: _val => {
          if (autoSubmit) {
            refs.current.onChange?.(_val)
            setShow(false)
          }
          setSelfValue(_val)
        }
      })
    }
    const RenderForm = renderForm
    return <RenderForm key={formKey} value={selfValue} onChange={setSelfValue} />
  }, [renderForm, selfValue, formKey, autoSubmit])

  return <>
    {child}
    {show && <PullView onClose={() => setShow(false)} side={side}>
      <context.Provider value={{ reset, submit }}>
        <Column
          className={classNames(
            'ModalForm',
            ['left', 'right'].includes(side) ? 'ModalForm--full h-full' : 'ModalForm--vertical',
            process.env.TARO_ENV === 'harmony' && ' items-center'
          )}
        >
          {!!title && <Row items='center' justify='between' className='ModalForm__head self-stretch'>
            <DuxuiIcon name='close' color='#fff' />
            <Text bold>{title}</Text>
            <DuxuiIcon name='close' color='#a3a5b6' onClick={() => setShow(false)} />
          </Row>}
          {renderHeader}
          {form}
          {renderFooter}
          {
            showButton && !autoSubmit && <>
              <Divider padding={0} />
              <Space row className='ModalForm__btns self-stretch'>
                <Reset type='primary' size='l' plain className='flex-grow' mode={resetMode}>重置</Reset>
                <Submit type='primary' size='l' className='flex-grow'>提交</Submit>
              </Space>
            </>
          }
        </Column>
      </context.Provider>
    </PullView>}
  </>
}

const Submit = ({ children, value, ...props }) => {
  const form = useContext(context)
  if (isValidElement(children)) {
    return cloneElement(children, {
      onClick: e => {
        children.props.onClick?.(e)
        form.submit(value)
      }
    })
  }
  return <Button {...props} onClick={() => form.submit(value)}>
    {children}
  </Button>
}

const Reset = ({ children, mode, ...props }) => {
  const form = useContext(context)
  if (isValidElement(children)) {
    return cloneElement(children, {
      onClick: e => {
        children.props.onClick?.(e)
        form.reset(mode)
      }
    })
  }
  return <Button {...props} onClick={() => form.reset(mode)}>
    {children}
  </Button>
}

ModalForm.Reset = Reset
ModalForm.Submit = Submit

export const ModalForms = ({
  title,
  children,
  renderForm,
  showButton = true,
  side,
  resetMode,
  autoSubmit,
  onSubmitBefore,
  ...props
}) => {

  const { values, defaultValues, setValues, ...contextData } = useFormContext()

  const [selfValue, setSelfValue] = useState({})

  const [show, setShow] = useState()
  const refs = useRef({})

  refs.current = { onSubmitBefore, setValues }

  useMemo(() => setSelfValue(deepCopy(values)), [values])

  /**
   * 重制设置值
   */
  const setValue = useCallback((field, value) => {
    setSelfValue(old => ({
      ...old,
      [field]: value
    }))
    autoSubmit && refs.current.setValues?.({ ...selfValue, [field]: value })
  }, [autoSubmit, selfValue])

  const selfSetValues = useCallback(data => {
    setSelfValue(old => ({
      ...old,
      ...data
    }))
  }, [])

  // 收集子表单的字段
  const fields = useRef([])
  const onGetField = useCallback((field, oldField) => {
    if (oldField) {
      const index = fields.current.indexOf(oldField)
      if (index) {
        fields.current.splice(index, 1)
      }
    }
    if (field) {
      fields.current.push(field)
    }
  }, [])

  const reset = useCallback(mode => {
    if (mode === 'prev') {
      const newValue = deepCopy(values)
      setSelfValue(newValue)
      autoSubmit && refs.current.setValues?.(newValue)
    } else if (mode === 'clear') {
      const _values = deepCopy(values)
      fields.current.forEach(field => {
        delete _values[field]
      })
      setSelfValue(_values)
      autoSubmit && refs.current.setValues?.(_values)
    } else {
      // default 重置到表单设置的默认值
      const _values = deepCopy(values)
      fields.current.forEach(field => {
        _values[field] = defaultValues[field]
      })
      setSelfValue(_values)
      autoSubmit && refs.current.setValues?.(_values)
    }
  }, [values, autoSubmit, defaultValues])

  const submit = useCallback(async () => {
    try {
      const task = refs.current.onSubmitBefore?.(selfValue)
      if (task instanceof Promise) {
        await task
      }
      refs.current.setValues?.(selfValue)
      setShow(false)
    } catch (error) {
      console.log('ModalForms:提交被阻止', error)
    }
  }, [selfValue])

  const child = useMemo(() => {
    if (isValidElement(children)) {
      return cloneElement(children, {
        ...props,
        onClick: () => setShow(old => !old)
      })
    }
    return <Text>请添加子元素</Text>
  }, [children, props])

  return <>
    {child}
    {show && <PullView onClose={() => setShow(false)} side={side}>
      <formContext.Provider value={{ ...contextData, onGetField, defaultValues, setValue, setValues: selfSetValues, values: selfValue }}>
        <context.Provider value={{ reset, submit }}>
          <Column className={classNames(
            'ModalForm',
            ['left', 'right'].includes(side) ? 'ModalForm--full h-full' : 'ModalForm--vertical',
            process.env.TARO_ENV === 'harmony' && ' items-center'
          )}
          >
            {!!title && <Row items='center' justify='between' className='ModalForm__head self-stretch'>
              <DuxuiIcon name='close' color='#fff' />
              <Text bold>{title}</Text>
              <DuxuiIcon name='close' color='#a3a5b6' onClick={() => setShow(false)} />
            </Row>}
            {renderForm}
            {
              showButton && <>
                <Divider padding={0} />
                <Space row className='ModalForm__btns self-stretch'>
                  <Reset type='primary' size='l' plain className='flex-grow' mode={resetMode}>重置</Reset>
                  <Submit type='primary' size='l' className='flex-grow'>提交</Submit>
                </Space>
              </>
            }
          </Column>
        </context.Provider>
      </formContext.Provider>
    </PullView>}
  </>
}

ModalForms.Reset = Reset
ModalForms.Submit = Submit
