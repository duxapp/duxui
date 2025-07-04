import { deepCopy, noop, ObjectManage } from '@/duxapp/utils'
import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import { Schema } from 'b-validate'

export const Form = forwardRef(({
  labelProps,
  containerProps,
  direction = 'horizontal',
  vertical,
  itemPadding = true,
  disabled,
  children,
  onChange,
  onSubmit,
  defaultValues: propsDefaultValues,
  cache
}, ref) => {

  // 让默认值和值默认是相同的
  const _defaultValues = useMemo(() => ({}), [])

  const [defaultValues, setDefaultValues] = useState(_defaultValues)

  const [values, updateValues] = useState(_defaultValues)

  // 将值保存起来
  const refs = useRef({}).current
  refs.values = values
  refs.onChange = onChange
  refs.onSubmit = onSubmit

  useEffect(() => {
    // 获取缓存或者指定的默认值
    getDefaultValue(propsDefaultValues, cache).then(res => {
      if (res) {
        setDefaultValues(res)
        updateValues(res)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // 实时保存values值到缓存
    if (!cache) {
      return
    }
    const instance = FormCache.getInstance()
    if (defaultValues !== values) {
      instance.merge({
        [cache]: values
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, defaultValues])

  useEffect(() => {
    if (defaultValues === values) {
      return
    }
    refs.onChange?.(deepCopy(values))
  }, [values, defaultValues, refs])

  const setValue = useCallback((key, value) => {
    updateValues(old => {
      old[key] = value
      return { ...old }
    })
  }, [])

  const setValues = useCallback((data, merge = true) => {
    if (merge) {
      updateValues(old => ({ ...old, ...data }))
    } else {
      updateValues(data)
    }
  }, [])

  /**
   * 存储验证规则
   */
  const validateSchemas = useRef({})

  const [validateErrors, setValidateErrors] = useState(null)

  /**
   * 表单验证
   */
  const validate = useCallback(async () => {
    return new Promise((resolve, reject) => {
      const schema = new Schema(validateSchemas.current)
      schema.validate(refs.values, errors => {
        if (!errors) {
          resolve()
        } else {
          reject(errors)
        }
        setValidateErrors(errors)
      })
    })
  }, [refs])

  /**
   * 收集表单验证
   */
  const addItem = useCallback(({ field, rules }) => {
    validateSchemas.current[field] = rules

    return {
      remove: () => {
        delete validateSchemas.current[field]
      }
    }
  }, [])

  const submit = useCallback(async () => {
    await validate()
    let status = refs.onSubmit?.(deepCopy(refs.values))
    // 表单提交完成，删除表单缓存
    if (cache) {
      if (status instanceof Promise) {
        status = await status
      }
      if (status === true) {
        FormCache.getInstance().merge({
          [cache]: undefined
        })
      }
    }
  }, [cache, refs, validate])

  const reset = useCallback(() => {
    updateValues(deepCopy(defaultValues))
    // refs.onChange?.(deepCopy(defaultValues))
  }, [defaultValues])

  useImperativeHandle(ref, () => {
    return {
      defaultValues,
      values,
      setValue,
      setValues,
      submit,
      reset,
      validate,
    }
  }, [defaultValues, values, reset, setValue, setValues, submit, validate])

  const result = {
    defaultValues, values,
    setValue, setValues, submit, reset, validate, addItem, itemPadding,
    labelProps, containerProps, direction, vertical, disabled, validateErrors
  }

  return <formContext.Provider value={result}>
    {
      typeof children === 'function'
        ? children(result)
        : children
    }
  </formContext.Provider>
})

export const formContext = /*@__PURE__*/ createContext({
  values: {},
  setValue: (field, value) => undefined,
  setValues: data => undefined,
  submit: noop,
  reset: noop,
  labelProps: {},
  containerProps: {},
  direction: 'horizontal',
  vertical: false,
  disabled: false,
  itemPadding: true,
  addItem: noop,
  /**
   * FormItem会触发此事件 用来收集子元素中的字段
   */
  onGetField: noop,
  /**
   * 验证结果
   */
  validateErrors: null
})

export const useFormContext = () => useContext(formContext)

class FormCache extends ObjectManage {
  constructor() {
    super({
      cache: true,
      cacheKey: 'duxui-form-cache'
    })
  }
}

const getDefaultValue = async (val, cache) => {
  if (cache && typeof cache === 'string') {
    const data = await FormCache.getInstance().getDataAsync()
    if (data[cache] && typeof data[cache] === 'object') {
      return data[cache]
    }
  }

  if (typeof val === 'function') {
    val = val()
  }
  if (val instanceof Promise) {
    val = await val
  }
  return val
}
