import { Easing } from '../Easing'
import { normalizeColor } from '../normalizeColor'
import { AnimatedWithChildren } from './WithChildren'

export class AnimatedInterpolation extends AnimatedWithChildren {

  _parent
  _config
  _interpolation

  constructor(parent, config) {
    super()
    this._parent = parent
    this._config = config
  }

  _getInterpolation() {
    if (!this._interpolation) {
      const config = this._config
      if (config.outputRange && typeof config.outputRange[0] === 'string') {
        this._interpolation = createStringInterpolation(config)
      } else {
        this._interpolation = createNumericInterpolation(config)
      }
    }
    return this._interpolation
  }

  interpolate(config) {
    return new AnimatedInterpolation(this, config)
  }

  __getValue() {
    const parentValue = this._parent.__getValue()
    return this._getInterpolation()(parentValue)
  }
}

function interpolate(
  input,
  inputMin,
  inputMax,
  outputMin,
  outputMax,
  easing,
  extrapolateLeft,
  extrapolateRight,
) {
  let result = input

  // Extrapolate
  if (result < inputMin) {
    if (extrapolateLeft === 'identity') {
      return result
    } else if (extrapolateLeft === 'clamp') {
      result = inputMin
    } else if (extrapolateLeft === 'extend') {
      // noop
    }
  }

  if (result > inputMax) {
    if (extrapolateRight === 'identity') {
      return result
    } else if (extrapolateRight === 'clamp') {
      result = inputMax
    } else if (extrapolateRight === 'extend') {
      // noop
    }
  }

  if (outputMin === outputMax) {
    return outputMin
  }

  if (inputMin === inputMax) {
    if (input <= inputMin) {
      return outputMin
    }
    return outputMax
  }

  // Input Range
  if (inputMin === -Infinity) {
    result = -result
  } else if (inputMax === Infinity) {
    result = result - inputMin
  } else {
    result = (result - inputMin) / (inputMax - inputMin)
  }

  // Easing
  result = easing(result)

  // Output Range
  if (outputMin === -Infinity) {
    result = -result
  } else if (outputMax === Infinity) {
    result = result + outputMin
  } else {
    result = result * (outputMax - outputMin) + outputMin
  }

  return result
}

const numericComponentRegex = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g

function mapStringToNumericComponents(
  input,
) {
  let normalizedColor = normalizeColor(input)

  if (typeof normalizedColor === 'number') {
    normalizedColor = normalizedColor || 0
    const r = (normalizedColor & 0xff000000) >>> 24
    const g = (normalizedColor & 0x00ff0000) >>> 16
    const b = (normalizedColor & 0x0000ff00) >>> 8
    const a = (normalizedColor & 0x000000ff) / 255
    return { isColor: true, components: [r, g, b, a] }
  } else {
    const components = []
    let lastMatchEnd = 0
    let match
    while ((match = (numericComponentRegex.exec(input))) != null) {
      if (match.index > lastMatchEnd) {
        components.push(input.substring(lastMatchEnd, match.index))
      }
      components.push(parseFloat(match[0]))
      lastMatchEnd = match.index + match[0].length
    }
    if (lastMatchEnd < input.length) {
      components.push(input.substring(lastMatchEnd, input.length))
    }
    return { isColor: false, components }
  }
}

function findRange(input, inputRange) {
  let i
  for (i = 1; i < inputRange.length - 1; ++i) {
    if (inputRange[i] >= input) {
      break
    }
  }
  return i - 1
}

function createNumericInterpolation(
  config,
) {
  const outputRange = (config.outputRange)
  const inputRange = config.inputRange

  const easing = config.easing || Easing.linear

  let extrapolateLeft = 'extend'
  if (config.extrapolateLeft !== undefined) {
    extrapolateLeft = config.extrapolateLeft
  } else if (config.extrapolate !== undefined) {
    extrapolateLeft = config.extrapolate
  }

  let extrapolateRight = 'extend'
  if (config.extrapolateRight !== undefined) {
    extrapolateRight = config.extrapolateRight
  } else if (config.extrapolate !== undefined) {
    extrapolateRight = config.extrapolate
  }

  return input => {

    const range = findRange(input, inputRange)
    return interpolate(
      input,
      inputRange[range],
      inputRange[range + 1],
      outputRange[range],
      outputRange[range + 1],
      easing,
      extrapolateLeft,
      extrapolateRight,
    )
  }
}

function createStringInterpolation(
  config,
) {
  const outputRange = config.outputRange.map(mapStringToNumericComponents)

  const isColor = outputRange[0].isColor

  const numericComponents =
    outputRange.map(output =>
      isColor
        ? // $FlowIgnoreMe[incompatible-call]
        output.components
        : // $FlowIgnoreMe[incompatible-call]
        output.components.filter(c => typeof c === 'number'),
    )
  const interpolations = numericComponents[0].map((_, i) =>
    createNumericInterpolation({
      ...config,
      outputRange: numericComponents.map(components => components[i]),
    }),
  )
  if (!isColor) {
    return input => {
      const values = interpolations.map(interpolation => interpolation(input))
      let i = 0
      return outputRange[0].components
        .map(c => (typeof c === 'number' ? values[i++] : c))
        .join('')
    }
  } else {
    return input => {
      const result = interpolations.map((interpolation, i) => {
        const value = interpolation(input)
        // rgba requires that the r,g,b are integers.... so we want to round them, but we *dont* want to
        // round the opacity (4th column).
        return i < 3 ? Math.round(value) : Math.round(value * 1000) / 1000
      })
      return `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${result[3]})`
    }
  }
}
