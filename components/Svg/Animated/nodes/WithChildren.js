import { AnimatedNode } from './Node'

export class AnimatedWithChildren extends AnimatedNode {
  _callback = null

  _children

  constructor() {
    super()
    this._children = []
  }

  __callListeners(value) {
    super.__callListeners(value)
    for (const child of this._children) {
      // $FlowFixMe[method-unbinding] added when improving typing for this parameters
      if (child.__getValue) {
        child.__callListeners(child.__getValue())
      }
    }
  }
}
