/* eslint-disable no-restricted-globals */
import { colorToRgb, getWindowInfo } from '@/duxapp'
import { Children, isValidElement, useRef } from 'react'
import { createOffscreenCanvas } from '@tarojs/taro'
import { AnimatedNode } from '../Animated/nodes/Node'
import { AnimatedInterpolation } from '../Animated/nodes/Interpolation'
import { toNativeEvent } from '../utils'

export const draw = (context, children = context.svgs, option) => {
  const result = []
  if (!context.ctx) {
    return result
  }
  const layout = context.layout
  // 从头渲染逻辑
  if (children === context.svgs) {
    context.ctx.clearRect(0, 0, layout.width, layout.height)
    // 应用viewBox
    if (layout.viewBoxTransform) {
      layout.viewBoxTransform()
      layout.viewBoxTransform = null
    }
    if (layout.viewBox) {
      if (typeof layout.viewBox === 'string') {
        layout.viewBox = layout.viewBox.split(/\s+|,/).filter(v => v !== '').map(v => +v)
      }
      if (layout.viewBox.length === 4) {
        const [minX, minY, vbWidth, vbHeight] = layout.viewBox

        const params = calculateAspectRatioFit({
          contentWidth: vbWidth,
          contentHeight: vbHeight,
          containerWidth: layout.width,
          containerHeight: layout.height,
          preserveAspectRatio: layout.preserveAspectRatio,
          contentX: minX,
          contentY: minY
        })

        // 应用变换
        context.ctx.save()
        if (params.scale.x !== undefined) {
          // none 模式，非等比缩放
          context.ctx.scale(params.scale.x, params.scale.y)
        } else {
          // 等比缩放
          context.ctx.scale(params.scale, params.scale)
        }
        context.ctx.translate(params.offsetX, params.offsetY)

        // 还原变换
        layout.viewBoxTransform = () => context.ctx.restore()
      }
    }
  }

  Children.forEach(children, child => {
    if (!isValidElement(child)) {
      return
    }

    const name = child.type.displayName

    const props = {
      ...parseSvgStyle(child.props.style),
      ...child.props
    }

    const beforeData = child.type.drawBefore?.(props, context)

    const currentContext = {
      ...context,
      ...props.clipPath
        ? createOffCanvas(layout.width, layout.height)
        : {}
    }

    const ctx = currentContext.ctx

    // 保存状态
    ctx.save()

    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'transparent'

    // 当前元素信息
    const getBbox = (() => {
      let val
      return () => {
        if (!val) {
          val = child.type?.bbox?.(props, currentContext, beforeData)
        }
        return val
      }
    })()

    for (const key in props) {
      let val = props[key]

      // 处理特殊属性
      if (typeof val === 'string') {
        if (val.startsWith('url(#')) {
          // 处理引用
          const def = val.slice(5, val.length - 1)
          if (currentContext.defs[def] && !disabledUrls.includes(name)) {
            const res = currentContext.defs[def]({
              bbox: getBbox()
            })
            if (res[0]?.instance) {
              val = res[0].instance
            }
          }
        } else {
          val = parseNumber(val, name, key, currentContext.layout)
        }
      } else if (val instanceof AnimatedInterpolation) {
        currentContext.addAnimated(val._parent)
        // 动画属性
        val = val.__getValue()
      } else if (val instanceof AnimatedNode) {
        currentContext.addAnimated(val)
        // 动画属性
        val = val.__getValue()
      }

      if (typeof val !== 'undefined') {
        props[key] = val
      }

      // 是否删除公共属性
      let delProps = true

      // 处理公共属性
      switch (key) {
        case 'opacity':
          ctx.globalAlpha = +val
          break

        case 'fill':
          ctx.fillStyle = notNoneVal(val) ? val : 'transparent'
          delProps = false
          break

        case 'fillOpacity':
          ctx.globalAlpha = +val
          break

        case 'stroke':
          ctx.strokeStyle = notNoneVal(val) ? val : 'transparent'
          delProps = false
          break

        case 'strokeWidth':
          ctx.lineWidth = +val
          break

        case 'strokeOpacity':
          const currentAlpha = ctx.globalAlpha || 1
          ctx.globalAlpha = currentAlpha * +val
          break

        case 'strokeLinecap':
          ctx.lineCap = val
          break

        case 'strokeLinejoin':
          ctx.lineJoin = val
          break

        case 'strokeDasharray':
          if (val === 'none') {
            ctx.setLineDash([])
          } else if (typeof val === 'string') {
            const dashArray = val.split(',').map(Number)
            ctx.setLineDash(dashArray)
          } else if (Array.isArray(val)) {
            ctx.setLineDash(val)
          }
          break

        case 'strokeDashoffset':
          ctx.lineDashOffset = +val
          break

        case 'transform':
          if (!disabledTransform.includes(name) && Array.isArray(val)) {
            applyTransform(currentContext.ctx, parseTransform(val, currentContext))
          }
          break

        default: {
          delProps = false
          break
        }
      }
      if (delProps) {
        delete props[key]
      }
    }
    // 应用属性上的变换
    if (!disabledTransform.includes(name)) {
      const transforms = getTransforms(props)
      if (transforms.length) {
        applyTransform(
          ctx,
          transforms,
          parseTransformProps(props, 'origin', [0, 0])?.values
        )
      }
    }

    props.beforeData = beforeData

    const res = child?.type?.draw?.(ctx, props, currentContext, option)

    // 应用裁剪
    if (props.clipPath) {
      props.clipPath.draw?.(currentContext)
      // 将离屏元素渲染到当前元素上
      context.ctx.drawImage(currentContext.canvas, 0, 0)
    }

    // 计算布局信息
    if (typeof props.onLayout === 'function') {
      const bbox = getBbox()
      if (bbox) {
        const transform = ctx.getTransform()
        result.push({
          onLayout: {
            el: child,
            callback: props.onLayout,
            value: () => ({
              nativeEvent: {
                layout: getTransformedBbox(transform, bbox)
              }
            })
          }
        })
      }
    }

    // 还原变换
    ctx.restore()

    if (res) {
      if (res instanceof Array) {
        result.push(...res)
      } else {
        result.push(res)
      }
    }
  })
  return result
}

const disabledUrls = ['DuxSvgUse', 'DuxSvgG', 'DuxSvgDefs', 'DuxSvgStop', 'ClipPath']

const disabledTransform = ['DuxSvgUse', 'DuxSvgDefs', 'DuxSvgStop', 'ClipPath']

const yAttrs = ['y', 'y1', 'height', 'y2', 'cy', 'fy', 'dy']

const originPercentage = {
  DuxSvgLinearGradient: ['x1', 'x2', 'y1', 'y2']
}

const parseNumber = (val, name, key, layout) => {
  if (val.endsWith('%')) {
    // 计算百分比值
    if (originPercentage[name]?.includes(key)) {
      return parseFloat(val) / 100
    } else {
      return parsePercentage(key, val, layout)
    }
    // eslint-disable-next-line no-restricted-globals
  } else if (!isNaN(val)) {
    // 将字符串类型的数字转换为数字
    return +val
  }
  return val
}

export const stopOpacityColor = (color, opacity = 1) => {
  if (+opacity === 1) {
    return color
  }
  return `rgba(${colorToRgb(color).join(',')},${opacity})`
}

export const margeProps = (oldProps, props) => {
  const newProps = {}
  for (const key in props) {
    if (typeof oldProps[key] === 'undefined') {
      newProps[key] = props[key]
    }
  }
  return newProps
}

export function notUndefined(val) {
  return typeof val !== 'undefined'
}

export const parsePercentage = (key, val, layout) => {
  const percentage = +val.slice(0, val.length - 1)
  if (!Number.isNaN(percentage)) {
    return layout[
      yAttrs.includes(key) ? 'height' : 'width'
    ] * percentage / 100
  }
  return val
}

export const parseOriginPercentage = val => {
  return typeof val === 'string' ?
    parseFloat(val) / (val.endsWith('%') ? 100 : 1) :
    val
}

function parseNumberArray(val) {
  const values = Array.isArray(val)
    ? val.map(v => +v)
    : typeof val === 'string'
      ? val.split(',').map(v => +v)
      : [+val]
  return values
}

export function parseAnimatedValue(val) {
  if (val instanceof AnimatedNode) {
    return val.__getValue()
  }
  return val
}

export function parseTransform(transform, context) {
  const result = {}
  const xyz = ['X', 'Y', 'Z']
  return transform.map(item => {
    const originName = Object.keys(item)[0]
    if (!originName) {
      return
    }
    const value = item[originName]
    let index = xyz.findIndex(key => originName.endsWith(key))
    const name = ~index ? originName.slice(0, originName.length - 1) : originName
    if (!~index) {
      index = 0
    }
    if (!result[name]) {
      result[name] = {
        type: name,
        values: []
      }
    }
    const values = (Array.isArray(value) ? value : [value]).map(v => {
      if (v instanceof AnimatedInterpolation) {
        context?.addAnimated(v._parent)
        // 动画属性
        return v.__getValue()
      } else if (v instanceof AnimatedNode) {
        context?.addAnimated(v)
        // 动画属性
        return v.__getValue()
      } else {
        return v
      }
    })
    if (originName === 'scale' && !Array.isArray(item[name])) {
      values.push(values[0])
    }
    if (index) {
      values.unshift(...new Array(index).fill(name === 'scale' ? 1 : 0))
    } else if (values.length === 1) {
      values.push(name === 'scale' ? 1 : 0)
    }
    return {
      type: name,
      values
    }
  }).filter(v => v)
}

export function parseTransformProps(props, name, defaultValue, towDefault) {
  let values = []
  if (notUndefined(props[name])) {
    values = parseNumberArray(props[name])
    delete props[name]
  }
  if (notUndefined(props[name + 'X'])) {
    values[0] = +props[name + 'X']
    delete props[name + 'X']
  }
  if (notUndefined(props[name + 'Y'])) {
    values[1] = +props[name + 'Y']
    delete props[name + 'Y']
  }
  if (values.length) {
    if (!notUndefined(values[0])) {
      values[0] = defaultValue[0]
    }
    if (values.length === 1 && towDefault) {
      values[1] = values[0]
    } else if (!notUndefined(values[1]) && notUndefined(defaultValue[1])) {
      values[1] = defaultValue[1]
    }
    return { type: name, values }
  }
}

export function getTransforms(props) {
  return [
    parseTransformProps(props, 'translate', [0, 0]),
    parseTransformProps(props, 'rotation', [0]),
    parseTransformProps(props, 'scale', [1, 1], true),
    parseTransformProps(props, 'skew', [0, 0], true),
  ].filter(v => v)
}

function parseSvgStyle(styleString) {
  if (!styleString || typeof styleString !== 'string') {
    return {}
  }

  const styleObject = {}

  // 按分号分割样式属性
  styleString.split(';').forEach((style) => {
    const [key, value] = style.split(':').map((str) => str.trim()) // 分割键值对并去除多余空格
    if (key && value) {
      // 将属性键值存入对象
      styleObject[key] = value
    }
  })

  return styleObject
}

function applyTransform(ctx, transforms, origin = []) {

  const [ox, oy] = restoreOrigin(ctx, origin)

  transforms.forEach(({ type, values }) => {

    switch (type) {
      case 'translate':
        ctx.translate(values[0] || 0, values[1] || 0)
        break
      case 'scale':
        const sx = values[0] || 1
        const sy = values[1] ?? sx
        ctx.translate(ox, oy)
        ctx.scale(sx, sy)
        ctx.translate(-ox, -oy)
        break
      case 'rotate': {
        const angle = getAngle(values[0])
        ctx.translate(ox, oy)
        ctx.rotate(angle)
        ctx.translate(-ox, -oy)
        break
      }
      case 'rotation': {
        const angle = Number.parseFloat(values[0]) * Math.PI / 180
        ctx.translate(ox, oy)
        ctx.rotate(angle)
        ctx.translate(-ox, -oy)
        break
      }
      case 'skew':
        const skewX = getAngle(values[0]) || 0
        const skewY = getAngle(values[1]) || 0
        ctx.translate(ox, oy)
        ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0)
        ctx.translate(-ox, -oy)
        break
      case 'matrix':
        const [a, b, c, d, e, f] = values
        ctx.transform(a, b, c, d, e, f)
        break
      default:
        console.warn(`Unsupported transform type: ${type}`)
    }
  })
}

const getAngle = val => {
  return typeof val === 'number' ? val : (Number.parseFloat(val) * Math.PI / 180)
}

function restoreOrigin(ctx, [ox = 0, oy = 0]) {

  const matrix = ctx.getTransform()

  return [
    ox - matrix.e / matrix.a,
    oy - matrix.f / matrix.d
  ]
}

export const notNoneVal = val => val !== 'none'

export function inverseTransformPoint(resultPoint, transforms, origin = [0, 0]) {
  const { x: x1, y: y1 } = resultPoint
  const [ox, oy] = origin

  // 初始化当前点为变换结果点
  let px = x1
  let py = y1

  // 倒序应用所有变换
  for (let i = 0; i < transforms.length; i++) {
    const transform = transforms[i]

    switch (transform.type) {
      case 'translate': {
        const [tx, ty] = transform.values
        // 平移的逆操作
        px -= tx
        py -= ty
        break
      }

      case 'rotation':
      case 'rotate': {
        const [angle] = transform.values // 角度以弧度为单位
        const cosTheta = Math.cos(-angle) // 反向旋转角度
        const sinTheta = Math.sin(-angle)

        // 将点移回到原点
        const dx = px - ox
        const dy = py - oy

        // 反向旋转
        const x = cosTheta * dx - sinTheta * dy
        const y = sinTheta * dx + cosTheta * dy

        // 移回原始位置
        px = x + ox
        py = y + oy
        break
      }

      case 'scale': {
        const [sx, sy] = transform.values
        // 将点移回到原点
        const dx = px - ox
        const dy = py - oy

        // 反向缩放
        const x = dx / sx
        const y = dy / sy

        // 移回原始位置
        px = x + ox
        py = y + oy
        break
      }

      case 'skew': {
        const [skewX, skewY] = transform.values

        // 将点移回到原点
        const dx = px - ox
        const dy = py - oy

        // 反向倾斜
        const x = dx - Math.tan(skewX) * dy
        const y = dy - Math.tan(skewY) * dx

        // 移回原始位置
        px = x + ox
        py = y + oy
        break
      }

      default:
        throw new Error(`Unknown transform type: ${transform.type}`)
    }
  }

  return {
    x: px,
    y: py
  }
}

export const useForwardEvent = (context, svgProps) => {
  const touchTarget = useRef()
  const checkTouchTarget = (xy, children, parent, parentTransforms = []) => {
    children = Children.toArray(children)
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i]
      const name = child.type.displayName
      const props = {}
      for (const key in child.props) {
        const val = child.props[key]
        if (typeof val === 'string') {
          props[key] = parseNumber(val, name, key, context.layout)
        } else {
          props[key] = parseAnimatedValue(val)
        }
      }
      const transforms = [
        ...parentTransforms,
        [getTransforms(props), parseTransformProps(props, 'origin', [0, 0])?.values]
      ]
      if (Array.isArray(props.transform)) {
        transforms.push([parseTransform(props.transform)])
      }

      if (name === 'DuxSvgG') {
        // 判断子元素事件 svg xy属性需要单独处理为变换
        transforms.push([
          [
            {
              type: 'translate',
              values: [props.x ?? 0, props.y ?? 0]
            }
          ]
        ])
        if (checkTouchTarget(xy, child.props.children, {
          props,
          parent,
          touch: xy
        }, transforms)) {
          return true
        }
      } else {
        let itemxy = xy
        transforms.forEach(transform => {
          itemxy = inverseTransformPoint(itemxy, ...transform)
        })
        if (child.type.range?.(itemxy, props, context)) {
          // 命中目标
          touchTarget.current = {
            props,
            parent,
            touch: xy
          }
          return true
        }
      }
    }
  }

  const touch = e => {
    if (e.type === 'touchstart') {
      const xy = getEventXY(e)
      touchTarget.current = {
        props: svgProps,
        touch: xy
      }
      checkTouchTarget(xy, context.svgs, touchTarget.current)
      const events = ['onPress', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onLongPress', 'onPressIn', 'onPressOut']
      while (touchTarget.current) {
        if (events.some(key => key in touchTarget.current.props)) {
          break
        }
        touchTarget.current = touchTarget.current.parent
      }
    }
    const target = touchTarget.current
    if (!target) {
      return
    }
    const name = eventTypes[e.type]
    const props = target.props
    props[name]?.(e)
    if (props && !props.disabled) {
      if (e.type === 'touchstart') {
        props.onPressIn?.(toNativeEvent(e))
      }
      if (e.type === 'touchend') {
        props.onPressOut?.(toNativeEvent(e))
        const xy = getEventXY(e)
        if (
          xy.x === target.touch.x
          && xy.y === target.touch.y
        ) {
          props.onPress?.(toNativeEvent(e))
        }
      }
      if (e.type === 'longpress') {
        props.onLongPress?.(toNativeEvent(e))
      }
    }

    if (e.type === 'touchend' || e.type === 'touchcancel') {
      touchTarget.current = null
    }
  }

  return {
    handlers: {
      onTouchStart: touch,
      onTouchMove: touch,
      onTouchEnd: touch,
      onTouchCancel: touch,
      onLongPress: touch
    }
  }
}

const getEventXY = e => {
  const touchItem = e.changedTouches?.[0]
  let xy = {}
  if (touchItem) {
    xy = { x: touchItem?.x, y: touchItem?.y }
    if (process.env.TARO_ENV === 'h5') {
      const rect = e.target.getBoundingClientRect()
      xy = {
        x: touchItem.pageX - rect.left,
        y: touchItem.pageY - rect.top
      }
    }
  }
  return xy
}

const eventTypes = {
  touchstart: 'onTouchStart',
  touchmove: 'onTouchMove',
  touchend: 'onTouchEnd',
  touchcancel: 'onTouchCancel'
}

/**
 * 创建离屏canvas
 * @returns
 */
export const createOffCanvas = (width, height) => {
  if (process.env.TARO_ENV === 'h5') {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return {
      canvas,
      ctx: canvas.getContext('2d')
    }
  } else {
    const canvas = createOffscreenCanvas({
      type: '2d',
      width,
      height
    })

    return {
      canvas,
      ctx: canvas.getContext('2d')
    }
  }
}

/**
 * 计算 preserveAspectRatio 相关的变换参数
 * @param {Object} options
 * @param {number} options.contentWidth - 内容原始宽度 (viewBox宽度或图片宽度)
 * @param {number} options.contentHeight - 内容原始高度 (viewBox高度或图片高度)
 * @param {number} options.containerWidth - 容器宽度 (画布宽度或指定宽度)
 * @param {number} options.containerHeight - 容器高度 (画布高度或指定高度)
 * @param {string} [preserveAspectRatio='xMidYMid meet'] - SVG preserveAspectRatio 值
 * @param {number} [contentX=0] - 内容原始X偏移 (viewBox的minX或图片的0)
 * @param {number} [contentY=0] - 内容原始Y偏移 (viewBox的minY或图片的0)
 * @returns {Object} 变换参数 { scale, offsetX, offsetY, sourceX, sourceY, sourceWidth, sourceHeight }
 */
export const calculateAspectRatioFit = ({
  contentWidth,
  contentHeight,
  containerWidth,
  containerHeight,
  preserveAspectRatio = 'xMidYMid meet',
  contentX = 0,
  contentY = 0,
  isImage = false
}) => {
  const [align, meetOrSlice = 'meet'] = preserveAspectRatio.split(/\s+/)
  const isSlice = meetOrSlice === 'slice'

  let scale, offsetX = 0, offsetY = 0
  let sourceX = 0, sourceY = 0
  let sourceWidth = contentWidth, sourceHeight = contentHeight
  let destX = 0, destY = 0, destWidth, destHeight

  if (align === 'none') {
    // 非等比缩放
    scale = {
      x: containerWidth / contentWidth,
      y: containerHeight / contentHeight
    }
    offsetX = -contentX * scale.x
    offsetY = -contentY * scale.y
    destWidth = containerWidth
    destHeight = containerHeight
  } else {
    // 等比缩放
    scale = isSlice
      ? Math.max(containerWidth / contentWidth, containerHeight / contentHeight)
      : Math.min(containerWidth / contentWidth, containerHeight / contentHeight)

    const scaledWidth = contentWidth * scale
    const scaledHeight = contentHeight * scale

    // 对于Image的slice模式，目标区域就是整个容器
    if (isImage && isSlice) {
      destWidth = containerWidth
      destHeight = containerHeight
    } else {
      destWidth = scaledWidth
      destHeight = scaledHeight
    }

    // 计算目标位置偏移
    if (isImage && isSlice) {
      // Image在slice模式下直接填满，不需要偏移
      offsetX = -contentX * scale
      offsetY = -contentY * scale
    } else {
      // 其他情况根据对齐方式计算偏移
      switch (align) {
        case 'xMinYMin':
          offsetX = -contentX * scale
          offsetY = -contentY * scale
          break
        case 'xMidYMin':
          offsetX = (containerWidth - scaledWidth) / 2 - contentX * scale
          offsetY = -contentY * scale
          break
        case 'xMaxYMin':
          offsetX = containerWidth - scaledWidth - contentX * scale
          offsetY = -contentY * scale
          break
        case 'xMinYMid':
          offsetX = -contentX * scale
          offsetY = (containerHeight - scaledHeight) / 2 - contentY * scale
          break
        case 'xMidYMid': // 默认
          offsetX = (containerWidth - scaledWidth) / 2 - contentX * scale
          offsetY = (containerHeight - scaledHeight) / 2 - contentY * scale
          break
        case 'xMaxYMid':
          offsetX = containerWidth - scaledWidth - contentX * scale
          offsetY = (containerHeight - scaledHeight) / 2 - contentY * scale
          break
        case 'xMinYMax':
          offsetX = -contentX * scale
          offsetY = containerHeight - scaledHeight - contentY * scale
          break
        case 'xMidYMax':
          offsetX = (containerWidth - scaledWidth) / 2 - contentX * scale
          offsetY = containerHeight - scaledHeight - contentY * scale
          break
        case 'xMaxYMax':
          offsetX = containerWidth - scaledWidth - contentX * scale
          offsetY = containerHeight - scaledHeight - contentY * scale
          break
      }
    }

    // 计算源裁剪区域 (仅 slice 模式需要)
    if (isSlice) {
      if (scale === containerWidth / contentWidth) {
        // 高度方向需要裁剪
        sourceHeight = containerHeight / scale
        if (align.includes('YMid')) {
          sourceY = (contentHeight - sourceHeight) / 2
        } else if (align.includes('YMax')) {
          sourceY = contentHeight - sourceHeight
        }
      } else {
        // 宽度方向需要裁剪
        sourceWidth = containerWidth / scale
        if (align.includes('xMid')) {
          sourceX = (contentWidth - sourceWidth) / 2
        } else if (align.includes('xMax')) {
          sourceX = contentWidth - sourceWidth
        }
      }
    }
  }

  return {
    scale,
    offsetX,
    offsetY,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destX,
    destY,
    destWidth: destWidth || (align === 'none' ? containerWidth : contentWidth * scale),
    destHeight: destHeight || (align === 'none' ? containerHeight : contentHeight * scale)
  }
}

/**
 * 获取变换之后的元素bbox
 * @param {*} transform
 * @param {*} bbox
 * @returns
 */
function getTransformedBbox(transform, bbox) {
  const { a, b, c, d, e, f } = transform

  // 原始 bbox 的 4 个顶点
  const points = [
    { x: bbox.x, y: bbox.y },
    { x: bbox.x + bbox.width, y: bbox.y },
    { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
    { x: bbox.x, y: bbox.y + bbox.height }
  ]

  const dpr = process.env.TARO_ENV !== 'h5' ? getWindowInfo().pixelRatio : 1

  // 应用变换矩阵
  const transformedPoints = points.map(p => ({
    x: (a * p.x + c * p.y + e) / dpr,
    y: (b * p.x + d * p.y + f) / dpr
  }))

  // 计算新的 bbox
  const minX = Math.min(...transformedPoints.map(p => p.x))
  const maxX = Math.max(...transformedPoints.map(p => p.x))
  const minY = Math.min(...transformedPoints.map(p => p.y))
  const maxY = Math.max(...transformedPoints.map(p => p.y))

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

/**
 * 编译优化
 * @returns
 */
export const pure = callback => callback()
