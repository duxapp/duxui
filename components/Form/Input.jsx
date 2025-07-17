import { Input as TaroInput } from '@tarojs/components'
import classNames from 'classnames'
import { duxappTheme } from '@/duxapp'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFormItemProxy } from './Form'
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

  const [val, setVal] = useFormItemProxy({ value, onChange, defaultValue })

  // 临时解决RN端输入框文本不居中的问题
  const _style = process.env.TARO_ENV === 'rn' ? {
    ...style,
    paddingVertical: 0,
    fontSize: style?.fontSize || 16,
    height: (style?.fontSize || 16) * 2,
    textAlignVertical: 'center'
  } : style

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
    style={_style}
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
