import { AnimatedValueXY } from './nodes/ValueXY'
import { AnimatedValue } from './nodes/Value'
import { AnimatedNode } from './nodes/Node'
import { TimingAnimation } from './animations/TimingAnimation'
import { AnimatedTracking } from './nodes/Tracking'

const _combineCallbacks = function (
  callback,
  config
) {
  if (callback && config.onComplete) {
    return (...args) => {
      config.onComplete && config.onComplete(...args)
      callback && callback(...args)
    }
  } else {
    return callback || config.onComplete
  }
}

const maybeVectorAnim = function (
  value,
  config,
  anim
) {
  if (value instanceof AnimatedValueXY) {
    const configX = { ...config }
    const configY = { ...config }
    for (const key in config) {
      const { x, y } = config[key]
      if (x !== undefined && y !== undefined) {
        configX[key] = x
        configY[key] = y
      }
    }
    const aX = anim(value.x, configX)
    const aY = anim(value.y, configY)
    // We use `stopTogether: false` here because otherwise tracking will break
    // because the second animation will get stopped before it can update.
    return parallel([aX, aY], { stopTogether: false })
  }
  return null
}

const timing = function (
  value,
  config,
) {
  const start = function (
    animatedValue,
    configuration,
    callback,
  ) {
    callback = _combineCallbacks(callback, configuration)
    const singleValue = animatedValue
    const singleConfig = configuration
    singleValue.stopTracking()
    if (configuration.toValue instanceof AnimatedNode) {
      singleValue.track(
        new AnimatedTracking(
          singleValue,
          configuration.toValue,
          TimingAnimation,
          singleConfig,
          callback,
        ),
      )
    } else {
      singleValue.animate(new TimingAnimation(singleConfig), callback)
    }
  }

  return (
    maybeVectorAnim(value, config, timing) || {
      start: function (callback) {
        start(value, config, callback)
      },

      stop: function () {
        value.stopAnimation()
      },

      reset: function () {
        value.resetAnimation()
      },
    }
  )
}

const sequence = function (
  animations,
) {
  let current = 0
  return {
    start: function (callback) {
      const onComplete = function (result) {
        if (!result.finished) {
          callback && callback(result)
          return
        }

        current++

        if (current === animations.length) {
          // if the start is called, even without a reset, it should start from the beginning
          current = 0
          callback && callback(result)
          return
        }

        animations[current].start(onComplete)
      }

      if (animations.length === 0) {
        callback && callback({finished: true})
      } else {
        animations[current].start(onComplete)
      }
    },

    stop: function () {
      if (current < animations.length) {
        animations[current].stop()
      }
    },

    reset: function () {
      animations.forEach((animation, idx) => {
        if (idx <= current) {
          animation.reset()
        }
      })
      current = 0
    },
  }
}

const parallel = function (
  animations,
  config,
) {
  let doneCount = 0
  // Make sure we only call stop() at most once for each animation
  const hasEnded = {}
  const stopTogether = !(config && config.stopTogether === false)

  const result = {
    start: function (callback) {
      if (doneCount === animations.length) {
        callback && callback({finished: true})
        return
      }

      animations.forEach((animation, idx) => {
        const cb = function (endResult) {
          hasEnded[idx] = true
          doneCount++
          if (doneCount === animations.length) {
            doneCount = 0
            callback && callback(endResult)
            return
          }

          if (!endResult.finished && stopTogether) {
            result.stop()
          }
        }

        if (!animation) {
          cb({finished: true})
        } else {
          animation.start(cb)
        }
      })
    },

    stop: function () {
      animations.forEach((animation, idx) => {
        !hasEnded[idx] && animation.stop()
        hasEnded[idx] = true
      })
    },

    reset: function () {
      animations.forEach((animation, idx) => {
        animation.reset()
        hasEnded[idx] = false
        doneCount = 0
      })
    },
  }

  return result
}

const delay = function (time) {
  // Would be nice to make a specialized implementation
  return timing(new AnimatedValue(0), {
    toValue: 0,
    delay: time,
    duration: 0,
  })
}

const stagger = function (
  time,
  animations,
) {
  return parallel(
    animations.map((animation, i) => {
      return sequence([delay(time * i), animation])
    }),
  )
}

const loop = function (
  animation,
  // $FlowFixMe[prop-missing]
  {iterations = -1, resetBeforeIteration = true} = {},
) {
  let isFinished = false
  let iterationsSoFar = 0
  return {
    start: function (callback) {
      const restart = function (result = {finished: true}) {
        if (
          isFinished ||
          iterationsSoFar === iterations ||
          result.finished === false
        ) {
          callback && callback(result)
        } else {
          iterationsSoFar++
          resetBeforeIteration && animation.reset()
          animation.start(restart)
        }
      }
      if (!animation || iterations === 0) {
        callback && callback({finished: true})
      } else {
        restart()
      }
    },

    stop: function () {
      isFinished = true
      animation.stop()
    },

    reset: function () {
      iterationsSoFar = 0
      isFinished = false
      animation.reset()
    }
  }
}

export default {
  Value: AnimatedValue,
  ValueXY: AnimatedValueXY,
  timing,
  createAnimatedComponent: Comp => Comp,
  Node: AnimatedNode,
  delay,
  parallel,
  sequence,
  stagger,
  loop
}
