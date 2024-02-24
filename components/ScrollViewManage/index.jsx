import { noop } from '@/duxapp'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const eventFunc = () => ({ remove: () => { } })

const context = createContext({
  refreshStatus: false,
  onRefresh: eventFunc,
  setRefresh: noop,
  bottomLoadStatus: false,
  onScrollToLower: eventFunc
})

export const ScrollViewManage = ({ defaultRefresh = false, children }) => {

  const [refreshStatus, setRefreshStatus] = useState(defaultRefresh)
  const [bottomLoadStatus, setBottomLoadStatus] = useState(false)

  const callbacks = useRef({
    top: [],
    bottom: []
  })

  // 设置为刷新状态
  const setRefresh = useCallback(() => {
    setRefreshStatus(true)
    Promise.all(callbacks.current.top.map(async item => {
      const res = item()
      if (res instanceof Promise) {
        await res
      }
    })).finally(() => setRefreshStatus(false))
  }, [])

  const onRefresh = useCallback(callback => {
    callbacks.current.top.push(callback)
    return {
      remove: () => {
        callbacks.current.top.splice(callbacks.current.top.indexOf(callback), 1)
      }
    }
  }, [])

  const scrollToLower = useCallback(() => {
    if (bottomLoadStatus) {
      return
    }
    setBottomLoadStatus(true)
    Promise.all(callbacks.current.bottom.map(async item => {
      const res = item()
      if (res instanceof Promise) {
        await res
      }
    })).finally(() => setBottomLoadStatus(false))
  }, [bottomLoadStatus])

  const onScrollToLower = useCallback((callback) => {
    callbacks.current.bottom.push(callback)
    return {
      remove: () => {
        callbacks.current.bottom.splice(callbacks.current.bottom.indexOf(callback), 1)
      }
    }
  }, [])

  const child = useMemo(() => {
    let _child = children
    if (typeof children === 'function') {
      _child = children({ refreshStatus, bottomLoadStatus })
    }
    if (React.isValidElement(_child)) {
      _child = React.cloneElement(_child, {
        onRefresh: () => {
          _child.onRefresh?.()
          setRefresh()
        },
        onScrollToLower: () => {
          _child.scrollToLower?.()
          scrollToLower()
        },
        refresh: refreshStatus
      })
    }

    return _child
  }, [children, refreshStatus, bottomLoadStatus, setRefresh, scrollToLower])

  return <context.Provider
    value={{
      refreshStatus,
      onRefresh,
      setRefresh,
      bottomLoadStatus,
      onScrollToLower
    }}
  >
    {child}
  </context.Provider>
}

ScrollViewManage.context = context
ScrollViewManage.useContext = () => useContext(context)
