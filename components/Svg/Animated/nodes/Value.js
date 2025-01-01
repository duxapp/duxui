import { AnimatedInterpolation } from './Interpolation'
import { AnimatedWithChildren } from './WithChildren'

export class AnimatedValue extends AnimatedWithChildren {

  _startingValue
  _value
  _offset = 0
  _animation = null

  constructor(value) {
    super()
    this._startingValue = this._value = value
  }

  setValue(value) {
    this._value = value
    this._updateValue(value, true)
  }

  setOffset(offset) {
    this._offset = offset
  }

  flattenOffset() {
    this._value += this._offset
    this._offset = 0
  }

  extractOffset() {
    this._offset += this._value
    this._value = 0
  }

  stopAnimation(callback) {
    this.stopTracking()
    this._animation && this._animation.stop()
    this._animation = null
    if (callback) {

    }
  }

  resetAnimation(callback) {
    this.stopAnimation(callback)
    this._value = this._startingValue
  }

  interpolate(config) {
    return new AnimatedInterpolation(this, config)
  }

  animate(animation, callback) {
    const previousAnimation = this._animation
    this._animation && this._animation.stop()
    this._animation = animation
    animation.start(
      this._value,
      value => {
        // Natively driven animations will never call into that callback, therefore we can always
        // pass flush = true to allow the updated value to propagate to native with setNativeProps
        this._updateValue(value)
      },
      result => {
        this._animation = null
        callback && callback(result)
      },
      previousAnimation,
      this,
    )
  }

  stopTracking() {
    // this._tracking && this._tracking.__detach()
    this._tracking = null
  }

  track(tracking) {
    this.stopTracking()
    this._tracking = tracking
    // Make sure that the tracking animation starts executing
    this._tracking && this._tracking.update()
  }

  _updateValue(value) {
    if (value === undefined) {
      throw new Error('AnimatedValue: Attempting to set value to undefined')
    }

    this._value = value

    this.__callListeners(this.__getValue())
  }

  __getValue() {
    return this._value + this._offset
  }
}
