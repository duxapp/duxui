import { View } from '@tarojs/components'
import { createContext, useCallback, useContext as useReactContext, useState } from 'react'
import { toast, route, stopPropagation, noop } from '@/duxapp/utils'
import './Select.scss'

const useCheck = (max = 99) => {
  const [checks, setChecks] = useState([])

  const isCheck = useCallback(value => {
    return checks.includes(value)
  }, [checks])

  const choice = useCallback(value => {
    setChecks(old => {
      const index = old.indexOf(value)
      if (~index) {
        old.splice(index, 1)
      } else {
        if (old.length >= max) {
          if (max == 1) {
            return [value]
          } else {
            toast('最多选择' + max + '项')
            return old
          }
        }
        old.push(value)
      }
      return [...old]
    })
  }, [max])

  return [
    checks,
    {
      isCheck,
      choice
    }
  ]
}

export const context = /*@__PURE__*/ createContext({ type: '', isCheck: noop, choice: noop, submit: noop })

const useContext = () => useReactContext(context)

export const ListSelect = ({
  children
}) => {
  const { params } = route.useRoute()
  const type = params.listSelectMax > 1 ? 'checkbox' : params.listSelectMax === 1 ? 'radio' : ''

  const [selects, { choice, isCheck }] = useCheck(params.listSelectMax || 1)

  const submit = useCallback(e => {
    stopPropagation(e)
    if (selects.length === 0) {
      return toast('请选择项目')
    }
    route.back(1, type === 'radio' ? selects[0] : selects)
  }, [selects, type])

  if (!type) {
    return children
  }

  return <context.Provider value={{ type, choice, isCheck, submit }}>
    {children}
  </context.Provider>
}

const ListSelectItem = ({
  id,
  item,
  children
}) => {
  const { type, choice, isCheck } = useContext()
  if (!type) {
    return children
  }
  return <View className='ListSelectItem' id={id}>
    <View className={`ListSelectItem__check${type === 'radio' ? ' ListSelectItem__check--radio' : ''}`} onClick={() => choice(item)}>
      {isCheck(item) && <View className={`ListSelectItem__check__child${type === 'radio' ? ' ListSelectItem__check__child--radio' : ''}`} />}
    </View>
    <View className='ListSelectItem__content'>
      {children}
    </View>
  </View>
}

const ListSelectSubmit = ({
  children
}) => {
  const { type, submit } = useContext()
  if (!type) {
    return null
  }
  return <View onClick={submit} className='ListSelectSubmit'>
    {children || <View className='ListSelectSubmit__btn'>确定</View>}
  </View>
}

ListSelect.Item = ListSelectItem
ListSelect.Submit = ListSelectSubmit
ListSelect.useContext = useContext
