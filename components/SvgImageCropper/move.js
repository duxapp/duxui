
export default {
  moveIn() {
    return true
  },
  move() {
    const state = this.getTouchState()
    const config = this.config
    const { ox, oy } = state.moveDot
    const { ox: tx, oy: ty } = state.temp || state.startDot
    state.temp = { ox, oy }
    config.x += (ox - tx)
    config.y += (oy - ty)
    this.updraw()
  }
}
