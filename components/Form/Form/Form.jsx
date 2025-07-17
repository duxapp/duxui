import { deepCopy, noop, ObjectManage } from '@/duxapp/utils'
import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'

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

  // 让值和值默认是相同的
  const _defaultValues = useMemo(() => {
    if (propsDefaultValues && typeof propsDefaultValues === 'object'
      && Object.getPrototypeOf(propsDefaultValues).constructor === Object
    ) {
      return propsDefaultValues
    }
    return {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [defaultValues, setDefaultValues] = useState(_defaultValues)

  const [values, updateValues] = useState(_defaultValues)

  // 将值保存起来
  const refs = useRef({ schemas: {} }).current
  refs.values = values
  refs.onChange = onChange
  refs.onSubmit = onSubmit

  useEffect(() => {
    // 获取缓存或者指定的默认值
    getDefaultValue(propsDefaultValues, cache).then(({ data, type }) => {
      if (data && data !== _defaultValues) {
        setDefaultValues(data)
        updateValues(old => ({ ...old, ...data }))
      }
      // 从函数的默认值来的则不进行缓存
      if (type !== 'default-func') {
        refs.cache = true
      }
    }).catch(error => {
      console.log('默认值获取失败：', error)
      refs.cache = true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // 实时保存values值到缓存
    if (!cache || !refs.cache) {
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
    if (refs.onChange) {
      refs.onChange(deepCopy(values))
    }
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
   * 表单验证
   */
  const validate = useCallback(async (checkAll = true) => {
    refs.error = 0
    for (const key in refs.schemas) {
      const callback = refs.schemas[key]
      if (checkAll) {
        try {
          await callback()
        } catch (error) {
          refs.error++
        }
      } else {
        await callback()
      }
    }
    if (checkAll && refs.error) {
      throw `${refs.error}个表单未验证通过`
    }
  }, [refs])

  const itemId = useRef(0)

  /**
   * 收集表单验证
   */
  const addRules = useCallback(callback => {
    const id = itemId.current++
    refs.schemas[id] = callback

    return {
      remove: () => {
        delete refs.schemas[id]
      }
    }
  }, [refs])

  const submit = useCallback(async data => {
    try {
      await validate()
      if (refs.onSubmit) {
        let status = refs.onSubmit(deepCopy({ ...refs.values, ...data }))
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
      }
    } catch (error) {
      console.log(error)
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
  })

  const result = {
    defaultValues, values,
    setValue, setValues, submit, reset, validate, addRules, itemPadding,
    labelProps, containerProps, direction, vertical, disabled
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
  addRules: noop,
  /**
   * FormItem会触发此事件 用来收集子元素中的字段
   */
  onGetField: noop
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

  if (typeof val === 'function') {
    val = val()
    if (val instanceof Promise) {
      val = await val
    }
    return { data: val, type: 'default-func' }
  }

  if (cache && typeof cache === 'string') {
    const data = await FormCache.getInstance().getDataAsync()
    if (data[cache] && typeof data[cache] === 'object') {
      return {
        data: data[cache],
        type: 'cache'
      }
    }
  }

  return { data: val, type: 'default' }
}
