import { useEffect, useMemo, useRef } from 'react'
import { TopView } from '@/duxapp'

export const Absolute = ({ children }) => {
  const action = useRef(null)

  useEffect(() => {
    return () => {
      if (!action.current) {
        console.error('在Absolute组件中你的内容过快的卸载了,这将导致你的子元素可能并未真正的卸载掉,请检查你的逻辑')
      } else {
        action.current.remove()
      }
    }
  }, [])

  useMemo(() => {
    if (action.current) {
      action.current.update(children)
      return
    }
    setTimeout(() => {
      if (!action.current) {
        action.current = TopView.add(children)
      } else {
        action.current.update(children)
      }
    }, 0)
  }, [children])

  return null
}
