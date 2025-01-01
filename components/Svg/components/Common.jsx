import { colorToRgb } from '@/duxapp'
import { Children, isValidElement, useRef } from 'react'
import { AnimatedNode } from '../Animated/nodes/Node'
import { AnimatedInterpolation } from '../Animated/nodes/Interpolation'

export const draw = (context, children = context.svgs, option) => {
  const result = []
  if (!context.ctx) {
    return result
  }
  if (children === context.svgs) {
    context.ctx.clearRect(0, 0, context.layout.width, context.layout.height)
  }
  Children.forEach(children, child => {
    if (!isValidElement(child)) {
      return
    }

    const props = {
      ...parseSvgStyle(child.props.style),
      ...child.props
    }

    const beforeData = child.type.drawBefore?.(props, context)

    const ctx = context.ctx

    // 保存状态
    ctx.save()

    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'transparent'

    for (const key in props) {
      let val = props[key]

      // 处理特殊属性
      if (typeof val === 'string') {
        if (val.startsWith('url(#')) {
          // 引用
          const def = val.slice(5, val.length - 1)
          if (context.defs[def] && !disabledUrls.includes(child.type.displayName)) {
            const res = context.defs[def]({
              bbox: child.type?.bbox?.(props, context, beforeData)
            })
            if (res[0]?.instance) {
              val = res[0].instance
            }
          }
        } else if (val.endsWith('%')) {
          // 计算百分百值
          val = parsePercentage(key, val, context.layout)
          // eslint-disable-next-line no-restricted-globals
        } else if (!isNaN(val)) {
          // 将字符串类型的数字转换为数字
          val = +val
        }
      } else if (val instanceof AnimatedInterpolation) {
        context.addAnimated(val._parent)
        // 动画属性
        val = val.__getValue()
      } else if (val instanceof AnimatedNode) {
        context.addAnimated(val)
        // 动画属性
        val = val.__getValue()
      }

      if (typeof val !== 'undefined') {
        props[key] = val
      }

      // 处理公共属性
      switch (key) {
        case 'opacity':
          ctx.globalAlpha = +val
          delete props[key]
          break

        case 'fill':
          ctx.fillStyle = val === 'none' ? 'transparent' : val
          // delete props[key]
          break

        case 'fillOpacity':
          ctx.globalAlpha = +val
          delete props[key]
          break

        case 'stroke':
          ctx.strokeStyle = val === 'none' ? 'transparent' : val
          // delete props[key]
          break

        case 'strokeWidth':
          ctx.lineWidth = +val
          delete props[key]
          break

        case 'strokeOpacity':
          const currentAlpha = ctx.globalAlpha || 1
          ctx.globalAlpha = currentAlpha * +val
          delete props[key]
          break

        case 'strokeLinecap':
          ctx.lineCap = val
          delete props[key]
          break

        case 'strokeLinejoin':
          ctx.lineJoin = val
          delete props[key]
          break

        case 'strokeDasharray':
          if (val === 'none') {
            ctx.setLineDash([])
          } else {
            const dashArray = val.split(',').map(Number)
            ctx.setLineDash(dashArray)
          }
          delete props[key]
          break

        case 'strokeDashoffset':
          ctx.lineDashOffset = +val
          delete props[key]
          break

        // 以后实现
        // case 'transform':
        //   if (!disabledTransform.includes(child.type.displayName)) {
        //     console.log(parseTransform(val))
        //     applyTransform(context.ctx, parseTransform(val))
        //     delete props[key]
        //   }
        //   break

        default: {
          break
        }
      }
    }
    // 应用属性上的变换
    if (!disabledTransform.includes(child.type.displayName)) {
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

    const res = child?.type?.draw?.(ctx, props, context, option)

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

const disabledUrls = ['DuxSvgImage', 'DuxSvgUse', 'DuxSvgG', 'DuxSvgDefs', 'DuxSvgStop']

const disabledTransform = ['DuxSvgUse', 'DuxSvgDefs', 'DuxSvgStop']

const yAttrs = ['y', 'y1', 'height', 'y2', 'cy', 'fy', 'dy']

export const stopOpacityColor = (color, opacity = 1) => {
  if (opacity === 1) {
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

function parseTransform(transform) {
  const result = []
  const regex = /(\w+)\(([^)]+)\)/g
  const transformMap = {
    translate: [0, 0], // 默认值 x: 0, y: 0
    scale: [1, 1], // 默认值 x: 1, y: 1
    skew: [0, 0], // 默认值 x: 0, y: 0
  }
  let match

  while ((match = regex.exec(transform)) !== null) {
    const type = match[1]
    const values = match[2]
      .split(/[\s,]+/)
      .map((val) => parseFloat(val))

    if (type in transformMap) {
      // 将单维度值扩展为二维
      if (values.length === 1) {
        values.push(transformMap[type][1])
      }

      // 合并到 transformMap
      transformMap[type] = [
        transformMap[type][0] + values[0],
        transformMap[type][1] + values[1],
      ]
    } else {
      // 非合并类型直接加入结果
      result.push({ type, values })
    }
  }

  // 将合并的类型加入结果
  Object.entries(transformMap).forEach(([type, values]) => {
    if (values[0] !== 0 || values[1] !== (type === 'scale' ? 1 : 0)) {
      result.push({ type, values })
    }
  })

  return result
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
      case 'rotate':
      case 'rotation':
        const angle = (values[0] * Math.PI) / 180
        ctx.translate(ox, oy)
        ctx.rotate(angle)
        ctx.translate(-ox, -oy)
        break
      case 'skew':
        const skewX = (values[0] || 0) * (Math.PI / 180)
        const skewY = (values[1] || 0) * (Math.PI / 180)
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
  const touch = e => {
    if (e.type === 'touchstart') {
      let xy = getEventXY(e)
      for (let i = context.svgs.length - 1; i >= 0; i--) {
        const item = context.svgs[i]
        const props = {}
        for (const key in item.props) {
          const val = item.props[key]
          if (typeof val === 'string') {
            if (val.endsWith('%')) {
              // 计算百分百值
              props[key] = parsePercentage(key, val, context.layout)
              // eslint-disable-next-line no-restricted-globals
            } else if (!isNaN(val)) {
              // 将字符串类型的数字转换为数字
              props[key] = +val
            } else {
              props[key] = val
            }
          } else {
            props[key] = parseAnimatedValue(val)
          }
        }
        xy = inverseTransformPoint(
          xy,
          getTransforms(props),
          parseTransformProps(props, 'origin', [0, 0])?.values
        )
        if (item.type.range?.(xy, props, context)) {
          // 命中目标
          touchTarget.current = {
            props,
            touch: xy
          }
          break
        }
      }
      // 未命中触发Svg本身的事件
      touchTarget.current = touchTarget.current || {
        props: svgProps,
        touch: xy
      }
    }
    const name = eventTypes[e.type]
    const target = touchTarget.current
    if (!target) {
      return
    }
    target.props[name]?.(e)
    if (target.props && !target.props.disabled) {
      if (e.type === 'touchstart') {
        target.props.onPressIn?.(e)
      }
      if (e.type === 'touchend') {
        target.props.onPressOut?.(e)
        const xy = getEventXY(e)
        if (
          xy.x === target.touch.x
          && xy.y === target.touch.y
        ) {
          target.props.onPress?.(e)
        }
      }
      if (e.type === 'longpress') {
        target.props.onLongPress?.(e)
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
