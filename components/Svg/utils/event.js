export const toNativeEvent = event => {
  const touch = event.changedTouches[0]

  if (process.env.TARO_ENV === 'h5') {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    // 计算相对于元素的坐标
    touch.x = touch.clientX - rect.left
    touch.y = touch.clientY - rect.top
  }
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
