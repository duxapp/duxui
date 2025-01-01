export const PanResponder = {
  create(config) {
    const gestureState = {
      stateID: Math.random(),
      x0: 0,
      y0: 0,
      moveX: 0,
      moveY: 0,
      dx: 0, // 累计移动的 x 方向距离
      dy: 0, // 累计移动的 y 方向距离
      vx: 0, // x 方向的速度
      vy: 0, // y 方向的速度
      numberActiveTouches: 0, // 当前触点数量
    }

    let lastMoveTime = 0

    let isMove = false

    return {
      panHandlers: {
        onTouchStart: evt => {
          const touches = evt.touches
          gestureState.numberActiveTouches = touches.length

          if (touches.length > 0) {
            const touch = touches[0]
            gestureState.x0 = touch.pageX
            gestureState.y0 = touch.pageY
            gestureState.dx = 0
            gestureState.dy = 0
            gestureState.vx = 0
            gestureState.vy = 0

            const nativeEvnet = toNativeEvent(evt)

            if (config.onStartShouldSetPanResponderCapture?.(nativeEvnet, gestureState)) {
              evt.stopPropagation()
            }

            if (config.onStartShouldSetPanResponder?.(nativeEvnet, gestureState)) {
              evt.preventDefault()
            }
          }
        },

        onTouchMove: evt => {
          const touches = evt.touches
          if (touches.length > 0) {
            const touch = touches[0]
            const now = Date.now()

            gestureState.moveX = touch.pageX
            gestureState.moveY = touch.pageY
            gestureState.dx = gestureState.moveX - gestureState.x0
            gestureState.dy = gestureState.moveY - gestureState.y0

            // 计算速度
            if (lastMoveTime) {
              const timeDelta = now - lastMoveTime
              gestureState.vx = gestureState.dx / timeDelta
              gestureState.vy = gestureState.dy / timeDelta
            }

            lastMoveTime = now

            const nativeEvnet = toNativeEvent(evt)

            if (config.onMoveShouldSetPanResponderCapture?.(nativeEvnet, gestureState)) {
              evt.stopPropagation()
            }

            if (config.onMoveShouldSetPanResponder?.(nativeEvnet, gestureState)) {
              evt.preventDefault()
              if (!isMove) {
                isMove = true
                config.onPanResponderGrant?.(nativeEvnet, gestureState)
              }
              config.onPanResponderMove?.(nativeEvnet, gestureState)
            }
          }
        },

        onTouchEnd: evt => {
          const changedTouches = evt.changedTouches
          if (changedTouches.length > 0) {
            const touch = changedTouches[0]
            gestureState.moveX = touch.pageX
            gestureState.moveY = touch.pageY
            gestureState.dx = gestureState.moveX - gestureState.x0
            gestureState.dy = gestureState.moveY - gestureState.y0

            if (isMove) {
              isMove = false
              config.onPanResponderRelease?.(toNativeEvent(evt), gestureState)
            }
          }
        },

        onTouchCancel: evt => {
          config.onPanResponderTerminate?.(toNativeEvent(evt), gestureState)
          if (isMove) {
            isMove = false
          }
        }
      }
    }
  }
}

const toNativeEvent = event => {
  const touch = event.changedTouches[0]
  return {
    nativeEvent: {
      changedTouches: event.changedTouches,
      locationX: touch.x,
      locationY: touch.y,
      pageX: touch.pageX,
      pageY: touch.pageY,
      touches: event.touches,
      taroEvent: event
    }
  }
}
