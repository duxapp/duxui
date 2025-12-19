import React, { PureComponent } from 'react'
import {
  Animated,
  Easing,
  I18nManager,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const TRACK_SIZE = 2
const DEFAULT_BLOCK_SIZE = 28

const DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100,
  },
  timing: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
    delay: 0,
  },
}

class Rect {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  containsPoint(x, y) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= this.x + this.width &&
      y <= this.y + this.height
    )
  }
}

const toNumber = (v, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export class Slider extends PureComponent {
  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    value: undefined,
    defaultValue: undefined,
    blockSize: DEFAULT_BLOCK_SIZE,
    blockColor: '#ffffff',
    activeColor: '#1aad19',
    backgroundColor: '#e9e9e9',
    color: '#e9e9e9',
    selectedColor: '#1aad19',
    showValue: false,
    animateTransitions: true,
    animationType: 'timing'
  }

  constructor(props) {
    super(props)
    this._isDragging = false
    this.state = {
      containerSize: { width: 0, height: 0 },
      trackSize: { width: 0, height: 0 },
      thumbSize: { width: 0, height: 0 },
      allMeasured: false,
      value: new Animated.Value(this._getInitialValue(props)),
    }
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })
  }

  componentDidUpdate(prevProps) {
    const nextValue = this._getPropValue(this.props)
    if (
      !this._isDragging &&
      prevProps.value !== this.props.value &&
      nextValue !== undefined
    ) {
      if (this.props.animateTransitions) {
        this._setCurrentValueAnimated(nextValue)
      } else {
        this._setCurrentValue(nextValue)
      }
    }
  }

  _getPropValue = (props) => {
    if (props.value !== undefined) {
      return toNumber(props.value, this._getMinimumValue(props))
    }
    const dv = props.defaultValue
    if (dv !== undefined) {
      return toNumber(dv, this._getMinimumValue(props))
    }
    return this._getMinimumValue(props)
  }

  _getInitialValue = (props) => {
    const value = this._getPropValue(props)
    return this._clamp(value, this._getMinimumValue(props), this._getMaximumValue(props))
  }

  _getMinimumValue = (props = this.props) =>
    toNumber(props.min ?? props.minimumValue, Slider.defaultProps.min)

  _getMaximumValue = (props = this.props) =>
    toNumber(props.max ?? props.maximumValue, Slider.defaultProps.max)

  _getStep = () => Math.max(0, toNumber(this.props.step, Slider.defaultProps.step))

  _getThumbTouchSize = () => {
    const blockSize = this._getBlockSize()
    return {
      width: blockSize,
      height: blockSize,
    }
  }

  _getBlockSize = () => {
    const { blockSize } = this.props
    const n = toNumber(blockSize, DEFAULT_BLOCK_SIZE)
    // Clamp to the platform-expected range 12-28
    return Math.min(Math.max(n, 12), 28)
  }

  _handleStartShouldSetPanResponder = (e) => this._thumbHitTest(e)

  _handleMoveShouldSetPanResponder = () => false

  _handlePanResponderGrant = () => {
    this._isDragging = true
    this._previousLeft = this._getThumbLeft(this._getCurrentValue())
  }

  _handlePanResponderMove = (e, gestureState) => {
    if (this.props.disabled) {
      return
    }
    this._setCurrentValue(this._getValue(gestureState))
    this._fireChanging()
  }

  _handlePanResponderRequestEnd = () => false

  _handlePanResponderEnd = (e, gestureState) => {
    this._isDragging = false
    if (this.props.disabled) {
      return
    }
    this._setCurrentValue(this._getValue(gestureState))
    this._fireChange()
  }

  _measureContainer = (e) => {
    this._handleMeasure('containerSize', e)
  }

  _measureTrack = (e) => {
    this._handleMeasure('trackSize', e)
  }

  _measureThumb = (e) => {
    this._handleMeasure('thumbSize', e)
  }

  _handleMeasure = (name, e) => {
    const { width, height } = e.nativeEvent.layout
    const size = { width, height }
    const storeName = `_${name}`
    const currentSize = this[storeName]
    if (
      currentSize &&
      width === currentSize.width &&
      height === currentSize.height
    ) {
      return
    }
    this[storeName] = size

    if (this._containerSize && this._trackSize && this._thumbSize) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
        allMeasured: true,
      })
    }
  }

  _getRatio = (value) =>
    (value - this._getMinimumValue()) /
    (this._getMaximumValue() - this._getMinimumValue() || 1)

  _getThumbLeft = (value) => {
    const nonRtlRatio = this._getRatio(value)
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio
    return (
      ratio * (this.state.containerSize.width - this.state.thumbSize.width)
    )
  }

  _getValue = (gestureState) => {
    const length = this.state.containerSize.width - this.state.thumbSize.width
    const thumbLeft = this._previousLeft + gestureState.dx
    const nonRtlRatio = length > 0 ? thumbLeft / length : 0
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio

    const minimumValue = this._getMinimumValue()
    const maximumValue = this._getMaximumValue()
    const step = this._getStep()

    const raw = ratio * (maximumValue - minimumValue) + minimumValue
    if (step > 0) {
      const rounded =
        minimumValue +
        Math.round((raw - minimumValue) / step) * step
      return this._clamp(rounded, minimumValue, maximumValue)
    }
    return this._clamp(raw, minimumValue, maximumValue)
  }

  _getCurrentValue = () => this.state.value.__getValue()

  _setCurrentValue = (value) => {
    this.state.value.setValue(value)
  }

  _setCurrentValueAnimated = (value) => {
    const animationType = this.props.animationType
    const animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      {
        toValue: value,
      },
    )

    Animated[animationType](this.state.value, animationConfig).start()
  }

  _fireChange = () => {
    const { onChange } = this.props
    if (onChange) {
      onChange({ detail: { value: this._getCurrentValue() } })
    }
  }

  _fireChanging = () => {
    const { onChanging } = this.props
    if (onChanging) {
      onChanging({ detail: { value: this._getCurrentValue() } })
    }
  }

  _getTouchOverflowSize = () => {
    const touchSize = this._getThumbTouchSize()
    const state = this.state
    const size = {}
    if (state.allMeasured === true) {
      size.width = Math.max(0, touchSize.width - state.thumbSize.width)
      size.height = Math.max(0, touchSize.height - state.containerSize.height)
    }

    return size
  }

  _getTouchOverflowStyle = () => {
    const { debugTouchArea } = this.props
    const { width, height } = this._getTouchOverflowSize()
    const touchOverflowStyle = {}
    if (width !== undefined && height !== undefined) {
      const verticalMargin = -height / 2
      touchOverflowStyle.marginTop = verticalMargin
      touchOverflowStyle.marginBottom = verticalMargin

      const horizontalMargin = -width / 2
      touchOverflowStyle.marginLeft = horizontalMargin
      touchOverflowStyle.marginRight = horizontalMargin
    }

    if (debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = 'orange'
      touchOverflowStyle.opacity = 0.5
    }

    return touchOverflowStyle
  }

  _thumbHitTest = (e) => {
    const nativeEvent = e.nativeEvent
    const thumbTouchRect = this._getThumbTouchRect()
    return thumbTouchRect.containsPoint(
      nativeEvent.locationX,
      nativeEvent.locationY,
    )
  }

  _getThumbTouchRect = () => {
    const state = this.state
    const touchOverflowSize = this._getTouchOverflowSize()
    const touchSize = this._getThumbTouchSize()

    return new Rect(
      touchOverflowSize.width / 2 +
      this._getThumbLeft(this._getCurrentValue()) +
      (state.thumbSize.width - touchSize.width) / 2,
      touchOverflowSize.height / 2 +
      (state.containerSize.height - touchSize.height) / 2,
      touchSize.width,
      touchSize.height,
    )
  }

  _clamp = (val, min, max) => Math.min(Math.max(val, min), max)

  render() {
    const {
      style,
      trackStyle,
      thumbStyle,
      debugTouchArea,
      showValue,
      color,
      selectedColor,
      activeColor,
      backgroundColor,
      blockColor,
    } = this.props
    const viewProps = { ...this.props }
    ;[
      'min',
      'minimumValue',
      'max',
      'maximumValue',
      'step',
      'disabled',
      'value',
      'defaultValue',
      'blockSize',
      'onChange',
      'onChanging',
      'animateTransitions',
      'animationType',
      'animationConfig',
      'trackSize',
      'className',
      'style',
      'trackStyle',
      'thumbStyle',
      'debugTouchArea',
      'showValue',
      'color',
      'selectedColor',
      'activeColor',
      'backgroundColor',
      'blockColor',
    ].forEach(key => {
      if (key in viewProps) {
        delete viewProps[key]
      }
    })
    const { value, containerSize, trackSize: _measuredTrackSize, thumbSize, allMeasured } = this.state

    const minimumValue = this._getMinimumValue()
    const maximumValue = this._getMaximumValue()
    const blockSize = this._getBlockSize()
    const resolvedThumbSize = {
      width: blockSize,
      height: blockSize,
    }
    const resolvedTrackSize = TRACK_SIZE

    const thumbLeft = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: I18nManager.isRTL
        ? [0, -(containerSize.width - thumbSize.width)]
        : [0, containerSize.width - thumbSize.width],
    })

    const minimumTrackWidth = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, containerSize.width - thumbSize.width],
    })

    const valueVisibleStyle = allMeasured ? {} : { opacity: 0 }

    const minimumTrackStyle = {
      position: 'absolute',
      width: Animated.add(minimumTrackWidth, thumbSize.width / 2),
      backgroundColor: activeColor || selectedColor || '#1aad19',
      ...valueVisibleStyle,
    }

    const touchOverflowStyle = this._getTouchOverflowStyle()

    const maximumTrackTintColor = backgroundColor || color || '#e9e9e9'
    const thumbTintColor = blockColor || '#ffffff'

    return (
      <View
        {...viewProps}
        style={[styles.container, style]}
        onLayout={this._measureContainer}
      >
        <View style={styles.sliderBody}>
          <View
            style={[
              { backgroundColor: maximumTrackTintColor, height: resolvedTrackSize },
              styles.track,
              trackStyle,
            ]}
            renderToHardwareTextureAndroid
            onLayout={this._measureTrack}
          />
          <Animated.View
            renderToHardwareTextureAndroid
            style={[
              styles.track,
              { height: resolvedTrackSize },
              trackStyle,
              minimumTrackStyle,
            ]}
          />
          <Animated.View
            onLayout={this._measureThumb}
            renderToHardwareTextureAndroid
            style={[
              styles.thumb,
              thumbStyle,
              {
                width: resolvedThumbSize.width,
                height: resolvedThumbSize.height,
                borderRadius: resolvedThumbSize.width / 2,
                backgroundColor: thumbTintColor,
                transform: [{ translateX: thumbLeft }, { translateY: 0 }],
                ...valueVisibleStyle,
              },
            ]}
          />
          <View
            renderToHardwareTextureAndroid
            style={[styles.touchArea, touchOverflowStyle]}
            {...this._panResponder.panHandlers}
          >
            {debugTouchArea === true && (
              <Animated.View
                style={[
                  styles.debugThumbTouchArea,
                  {
                    left: thumbLeft,
                    top: this._getThumbTouchRect().y,
                    width: this._getThumbTouchRect().width,
                    height: this._getThumbTouchRect().height,
                  },
                ]}
                pointerEvents='none'
              />
            )}
          </View>
        </View>
        {showValue && (
          <Text style={styles.valueText}>{this._getCurrentValue()}</Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderBody: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },
  thumb: {
    position: 'absolute',
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugThumbTouchArea: {
    position: 'absolute',
    backgroundColor: 'green',
    opacity: 0.5,
  },
  valueText: {
    marginLeft: 8,
  },
})

export default Slider
