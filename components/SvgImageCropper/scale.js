export default {
  startIn(e) {
    return e.touches.length === 2
  },
  start(e) {
    const touches = e.touches
    if (touches.length < 2) {
      return
    }
    const state = this.getTouchState()
    // 缩放模式
    const x1 = touches[0].clientX
    const y1 = touches[0].clientY
    const x2 = touches[1].clientX
    const y2 = touches[1].clientY

    state.start = {
      initialDistance: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
      initialScale: this.config.scale
    }
  },
  move(e) {
    const touches = e.touches
    if (touches.length < 2) {
      return
    }
    const state = this.getTouchState()
    const x1 = touches[0].clientX
    const y1 = touches[0].clientY
    const x2 = touches[1].clientX
    const y2 = touches[1].clientY
    const currentDistance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

    // 计算缩放比例
    const scale = Math.max(Math.min(
      (currentDistance / state.start.initialDistance) * state.start.initialScale,
      2
    ), 0.8)

    // 更新 canvasConfig
    const config = this.config
    const centerSelf = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
    const dscale = scale / config.scale
    config.x -= (dscale - 1) * (centerSelf.x - config.x)
    config.y -= (dscale - 1) * (centerSelf.y - config.y)
    config.scale = scale
    this.updraw()
  }
}
