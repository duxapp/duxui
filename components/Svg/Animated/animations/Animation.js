/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict'

// Important note: start() and stop() will only be called at most once.
// Once an animation has been stopped or finished its course, it will
// not be reused.
export class Animation {
  __active
  __onEnd
  __iterations

  start(
    fromValue,
    onUpdate,
    onEnd,
    previousAnimation,
    animatedValue,
  ) {}

  stop() {

  }

  // Helper function for subclasses to make sure onEnd is only called once.
  __debouncedOnEnd(result) {
    const onEnd = this.__onEnd
    this.__onEnd = null
    onEnd && onEnd(result)
  }
}
