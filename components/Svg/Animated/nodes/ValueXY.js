import { AnimatedWithChildren } from './WithChildren'
import { AnimatedValue } from './Value'

let _uniqueId = 1

export class AnimatedValueXY extends AnimatedWithChildren {

  _x
  _y
  _listeners

  constructor(
    valueIn
  ) {
    super()
    const value = valueIn || { x: 0, y: 0 }
    if (typeof value.x === 'number' && typeof value.y === 'number') {
      this.x = new AnimatedValue(value.x)
      this.y = new AnimatedValue(value.y)
    } else {
      this.x = value.x
      this.y = value.y
    }
    this._listeners = {}
  }

  setValue(value) {
    this.x.setValue(value.x)
    this.y.setValue(value.y)
  }

  setOffset(offset) {
    this.x.setOffset(offset.x)
    this.y.setOffset(offset.y)
  }

  flattenOffset() {
    this.x.flattenOffset()
    this.y.flattenOffset()
  }

  extractOffset() {
    this.x.extractOffset()
    this.y.extractOffset()
  }

  __getValue() {
    return {
      x: this.x.__getValue(),
      y: this.y.__getValue(),
    }
  }

  resetAnimation(
    callback,
  ) {
    this.x.resetAnimation()
    this.y.resetAnimation()
    callback && callback(this.__getValue())
  }

  stopAnimation(callback) {
    this.x.stopAnimation()
    this.y.stopAnimation()
    callback && callback(this.__getValue())
  }

  addListener(callback) {
    const id = String(_uniqueId++)
    const jointCallback = ({ value }) => {
      callback(this.__getValue())
    }
    this._listeners[id] = {
      x: this.x.addListener(jointCallback),
      y: this.y.addListener(jointCallback),
    }
    return id
  }

  removeListener(id) {
    this.x.removeListener(this._listeners[id].x)
    this.y.removeListener(this._listeners[id].y)
    delete this._listeners[id]
  }

  removeAllListeners() {
    this.x.removeAllListeners()
    this.y.removeAllListeners()
    this._listeners = {}
  }

  getLayout() {
    return {
      left: this.x,
      top: this.y,
    }
  }

  getTranslateTransform() {
    return [{ translateX: this.x }, { translateY: this.y }]
  }
}
