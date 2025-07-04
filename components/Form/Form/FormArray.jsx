import { isValidElement, cloneElement, Fragment, createContext, useContext, useMemo, useCallback, useRef } from 'react'
import { useFormContext, formContext } from './Form'

const arrayContext = /*@__PURE__*/ createContext({})

export const FormArray = ({
  value,
  onChange,
  renderTop,
  renderBottom,
  renderItem: RenderItem,
  itemContainer: ItemContainer = Fragment,
  children
}) => {

  const form = useFormContext()

  const setValues = useCallback(val => {
    onChange?.(val)
  }, [onChange])

  // 将value保存到ref 在RN上调用setValue时，不会调用到最新的函数，暂时不知道是什么问题
  const valueRef = useRef(value)
  valueRef.current = value

  const setValue = useCallback((index, val) => {
    const _value = Array.isArray(valueRef.current) ? [...valueRef.current] : []
    _value[index] = val
    onChange?.(_value)
  }, [onChange])

  const defaultData = useMemo(() => [], [])

  return <formContext.Provider
    value={{
      ...form,
      values: value || defaultData, setValues, setValue,
      parent: form
    }}
  >
    <arrayContext.Provider value={{ values: value || defaultData, setValues, setValue }}>
      {renderTop}
      <ItemContainer>
        {
          RenderItem ?
            value?.map((item, index) => <RenderItem key={index} value={item} index={index} values={value} />) :
            children
        }
      </ItemContainer>
      {renderBottom}
    </arrayContext.Provider>
  </formContext.Provider>
}

export const FormArrayAction = ({
  action,
  children
}) => {

  const { values, setValues } = useContext(arrayContext)

  const click = useCallback(() => {
    if (typeof action === 'function') {
      setValues(action(values ? [...values] : []))
    }
  }, [action, setValues, values])

  if (isValidElement(children)) {
    return cloneElement(children, {
      onClick: click
    })
  }
  console.error('ArrayAction组件只能传入一个具有点击事件的子组件')
  return null
}
