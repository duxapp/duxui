import { View } from '@tarojs/components'
import { createContext, useCallback, useContext as useReactContext, useState } from 'react'
import { toast, route, stopPropagation, noop } from '@/duxapp/utils'
import { duxuiLang, pure } from '@/duxui/utils'
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
            toast(duxuiLang.t('listSelect.maxSelect', { params: { max } }))
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

const ListSelectComponent = ({
  children
}) => {
  const t = duxuiLang.useT()
  const { params } = route.useRoute()
  const type = params.listSelectMax > 1 ? 'checkbox' : params.listSelectMax === 1 ? 'radio' : ''

  const [selects, { choice, isCheck }] = useCheck(params.listSelectMax || 1)

  const submit = useCallback(e => {
    stopPropagation(e)
    if (selects.length === 0) {
      return toast(t('listSelect.pleaseSelectItem'))
    }
    route.back(1, type === 'radio' ? selects[0] : selects)
  }, [selects, type, t])

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
  const t = duxuiLang.useT()
  if (!type) {
    return null
  }
  return <View onClick={submit} className='ListSelectSubmit'>
    {children || <View className='ListSelectSubmit__btn'>{t('common.ok')}</View>}
  </View>
}

export const ListSelect = /*@__PURE__*/ pure(() => {
  ListSelectComponent.Item = ListSelectItem
  ListSelectComponent.Submit = ListSelectSubmit
  ListSelectComponent.useContext = useContext
  return ListSelectComponent
})
