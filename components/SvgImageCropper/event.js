/* eslint-disable react-hooks/rules-of-hooks */
import { stopPropagation } from '@/duxapp'
import { useEffect, useReducer } from 'react'

import scale from './scale'
import move from './move'

export class Touch {

  // 当前触摸类型
  touchState = null
  touchEndCount = 0
  // {
  //   actions: [],
  //   // touch 事件的点
  //   startTime: null,
  //   startDot: { x: 0, y: 0, ox: 0, oy: 0 },
  //   moveDot: null,
  //   endDot: null,
  //   // 移动事件初始化
  //   moveInit: false
  // }

  config = {
    x: 0,
    y: 0,
    scale: 1
  }

  touchStart(e) {

    // 手动结束之前的触摸事件，开始新的事件
    if (this.touchState) {
      this.touchEnd(e, true)
      this.touchEndCount++
    }

    // 开始新的事件
    const state = this.touchState = {
      actions: [],
      startTime: Date.now()
    }

    state.startDot = resolveDot(this.config, e)

    /**
     * 开始元件操作
     */
    const action = [scale].find(v => v.startIn.call(this, e))
    if (action) {
      state.actions.push(action)
    }

    state.actions.forEach(c => c.start?.call(this, e))
  }

  touchMove(e) {
    const state = this.getTouchState()
    state.moveDot = resolveDot(this.config, e)

    if (!state.moveInit && !state.actions.includes(scale)) {
      state.moveInit = true

      const action = [move].find(v => v.moveIn.call(this, e))

      if (action) {
        state.actions.push(action)
      }
    }
    state.actions.forEach(c => c.move?.call(this, e))
  }

  touchEnd(e, self) {
    if (this.touchEndCount && !self) {
      this.touchEndCount--
      return
    }

    const state = this.getTouchState()
    state.endDot = resolveDot(this.config, e)

    if (state.actions?.length) {
      state.actions.forEach(c => c.end?.call(this, e))
    }

    this.clearState()
  }

  touchCancel() {
    const state = this.getTouchState()
    state.actions.forEach(c => c.cancel?.call(this))
    this.clearState()
  }

  updraw() {
    if (process.env.TARO_ENV === 'rn') {
      if (this.animationFrame) {
        return
      }
      this.animationFrame = requestAnimationFrame(() => {
        this.animationFrame = null
        this.forceUpdate?.()
      })
    } else {
      if (this.timer) {
        return
      }
      this.timer = setTimeout(() => {
        this.timer = null
        this.forceUpdate?.()
      }, 16.666)
    }
  }

  useConfig() {

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
      this.forceUpdate = forceUpdate

      return () => {
        this.forceUpdate = null
      }
    }, [])

    return this.config
  }

  getTouchState() {
    return this.touchState
  }

  clearState = () => {
    this.touchState = null
  }
}

const resolveDot = (config, e) => { // 解析touch 坐标，同时兼容h5和微信小程序
  stopPropagation(e)
  let { x, y, clientX, clientY, pageX, pageY } = e.changedTouches[0]
  if (typeof x === 'undefined') {
    x = clientX
    y = clientY
  }
  const a = {
    x: Math.round((x - config.x) / config.scale),
    y: Math.round((y - config.y) / config.scale),
    ox: Math.round(x),
    oy: Math.round(y),
    pageX,
    pageY
  }
  return a
}
