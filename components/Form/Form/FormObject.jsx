import { useMemo, useCallback, useRef } from 'react'
import { useFormContext, formContext } from './Form'

export const FormObject = ({
  value,
  onChange,
  children
}) => {

  const form = useFormContext()

  const setValues = useCallback(_data => {
    onChange?.({ ...value, ..._data })
  }, [onChange, value])

  // 将value保存到ref 在RN上调用setValue时，不会调用到最新的函数，暂时不知道是什么问题
  const valueRef = useRef(value)
  valueRef.current = value

  const setValue = useCallback((field, val) => {
    const _value = typeof valueRef.current === 'object' ? { ...valueRef.current } : {}
    _value[field] = val
    onChange?.(_value)
  }, [onChange])

  const defaultData = useMemo(() => ({}), [])

  return <formContext.Provider
    value={{
      ...form, values: value || defaultData,
      setValues, setValue,
      parent: form
    }}
  >
    {children}
  </formContext.Provider>
}
