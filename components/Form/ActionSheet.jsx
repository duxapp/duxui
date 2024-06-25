import { Children, cloneElement, isValidElement, useMemo } from 'react'
import Taro from '@tarojs/taro'

export const ActionSheetForm = ({ value, range, nameKey = 'name', valueKey = 'value', onChange, children }) => {
  const isObject = typeof range[0] === 'object'

  const select = useMemo(() => {
    const index = range?.findIndex((v) => {
      if (isObject) {
        return v[valueKey] === value
      } else {
        return v === value
      }
    })
    if (index === undefined || !~index) {
      return ''
    }
    return index
  }, [isObject, range, value, valueKey])


  if (typeof children === 'function') {
    children = children({ select, item: range?.[select] })
  }

  if (Children.only(children) && isValidElement(children)) {
    return cloneElement(children, {
      onClick: async e => {
        children.props.onClick?.(e)
        const { tapIndex } = await Taro.showActionSheet({
          itemList: isObject ? range.map(v => v[nameKey]) : range
        })
        const item = range[tapIndex]
        if (isObject) {
          onChange(item[valueKey])
        } else {
          onChange(item)
        }
      }
    })
  }
  console.warn('ActionSheetForm组件子元素需要是单一的可点击元素')
  return null
}
