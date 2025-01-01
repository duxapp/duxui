let _uniqueId = 1

export class AnimatedNode {
  _listeners

  constructor() {
    this._listeners = {}
  }

  addListener(callback) {
    const id = String(_uniqueId++)
    this._listeners[id] = callback
    return id
  }

  removeListener(id) {
    delete this._listeners[id]
  }

  removeAllListeners() {
    this._listeners = {}
  }

  hasListeners() {
    return !!Object.keys(this._listeners).length
  }

  __onAnimatedValueUpdateReceived(value) {
    this.__callListeners(value)
  }

  __callListeners(value) {
    for (const key in this._listeners) {
      this._listeners[key]({ value })
    }
  }

  toJSON() {
    return this.__getValue()
  }
}
