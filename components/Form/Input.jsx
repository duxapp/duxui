import { Input as TaroInput } from '@tarojs/components'
import classNames from 'classnames'
import { duxappTheme } from '@/duxapp'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Form } from './Form'
import './Input.scss'

export const Input = ({
  grow,
  shrink,
  self,
  align,
  className,
  style,
  value,
  onChange,
  defaultValue,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({ value, onChange, defaultValue })

  return <TaroInput
    onInput={setVal}
    className={classNames(
      'DuxInput',
      grow && 'flex-grow',
      shrink && 'flex-shrink',
      self && 'self-' + self,
      align && 'text-' + align,
      className
    )}
    style={style}
    placeholderTextColor={duxappTheme.textColor3}
    placeholderStyle={`color: ${duxappTheme.textColor3}`}
    {...props}
    value={val}
  />
}

export const InputSearch = ({
  value,
  onChange,
  ...props
}) => {

  const [val, setVal] = useState(value)

  const timer = useRef(null)

  useEffect(() => {
    setVal(value)
  }, [value])

  const input = useCallback(e => {
    setVal(e)
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      onChange?.(e)
    }, 300)
  }, [onChange])

  return <Input onChange={input} value={val ?? ''} {...props} />
}

Input.Search = InputSearch
