import { AnimatedNode } from './Node'

export class AnimatedTracking extends AnimatedNode {
  _value
  _parent
  _callback
  _animationConfig
  _animationClass

  constructor(
    value,
    parent,
    animationClass,
    animationConfig,
    callback,
  ) {
    super()
    this._value = value
    this._parent = parent
    this._animationClass = animationClass
    this._animationConfig = animationConfig
    this._callback = callback
    this.__attach()
  }

  __getValue() {
    return this._parent.__getValue()
  }

  update() {
    this._value.animate(
      new this._animationClass({
        ...this._animationConfig,
        toValue: (this._animationConfig.toValue).__getValue(),
      }),
      this._callback,
    )
  }

}
