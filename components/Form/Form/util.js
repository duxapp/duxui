import { useDeepObject } from '@/duxapp/utils'
import { useEffect, useState, useCallback, useRef } from 'react'

export const useFormItemProxy = ({ value, onChange, defaultValue } = {}) => {

  const [val, setVal] = useState(value ?? defaultValue)

  const refs = useRef({
    val,
    first: true,
    onChange
  })

  refs.current.onChange = onChange

  const input = useCallback(e => {
    let _val = e?.detail?.value ?? e
    setVal(old => {
      _val = typeof _val === 'function' ? _val(old) : _val
      refs.current.val = _val
      refs.current.onChange?.(_val)
      return _val
    })
  }, [])

  const deepValue = useDeepObject(value)

  useEffect(() => {
    // 反向更新值
    if (refs.current.first) {
      refs.current.first = false
      return
    }
    if (refs.current.val !== deepValue) {
      refs.current.val = deepValue
      setVal(deepValue)
    }
  }, [deepValue])

  useEffect(() => {
    // 更新默认值
    if (refs.current.onChange && typeof value === 'undefined' && typeof defaultValue !== 'undefined') {
      refs.current.onChange(defaultValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [val, input]
}
