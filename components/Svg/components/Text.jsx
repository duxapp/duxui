import { isValidElement } from 'react'
import { notNoneVal, notUndefined } from './Common'

export const Text = () => {
  return null
}

export const TSpan = () => {
  return null
}

Text.displayName = 'DuxSvgText'

TSpan.displayName = 'DuxSvgTSpan'

Text.drawBefore = (props, { ctx }) => {
  return parseChildren(ctx, props)
}

Text.bbox = (props, context, beforeData) => {

  if (!beforeData.length) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  beforeData.forEach(({ bbox: { x, y, width, height } }) => {
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x + width)
    maxY = Math.max(maxY, y + height)
  })

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

Text.draw = (ctx, { beforeData }) => {

  beforeData.forEach(item => {
    ctx.save()
    setStyle(ctx, item.props)
    if (notNoneVal(item.props.fill)) {
      ctx.fillText(item.t, item.x, item.y)
    }
    if (notNoneVal(item.props.stroke)) {
      ctx.strokeText(item.t, item.x, item.y)
    }
    ctx.restore()
  })
}

const parsed = d => {
  if (Array.isArray(d)) {
    return d
  } else if (typeof d === 'number') {
    return [d]
  } else if (typeof d === 'string' && d) {
    return d.split(' ').map(Number)
  }
  return []
}

const parseChildren = (
  ctx,
  { children, x, y, dx, dy, ...props },
  oldDxs = [], oldDys = [],
  xy = {},
  arr = []
) => {
  if (!children) {
    return arr
  }

  xy.x = x ?? xy.x ?? 0
  xy.y = y ?? xy.y ?? 0

  children = Array.isArray(children) ? children : [children]

  const dxs = notUndefined(dx) ? parsed(dx) : oldDxs
  const dys = notUndefined(dy) ? parsed(dy) : oldDys

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (isValidElement(child)) {
      if (child.type.displayName === 'DuxSvgTSpan') {
        parseChildren(ctx, { ...props, ...child.props }, dxs, dys, xy, arr)
      }
    } else {
      let text = '' + child
      while (text.length && (dxs.length || dys.length)) {
        ctx.save()
        setStyle(ctx, props)
        const dxi = dxs.shift() || 0
        const dyi = dys.shift() || 0
        if (notUndefined(dx)) {
          oldDxs.shift()
        }
        if (notUndefined(dy)) {
          oldDys.shift()
        }
        const bbox = textBbox(ctx, text[0], xy.x, xy.y, props.fontSize, props.textAnchor)
        ctx.restore()
        xy.x += dxi
        xy.y += dyi
        arr.push({
          t: text[0],
          x: xy.x,
          y: xy.y,
          dx: dxi,
          dy: dyi,
          props,
          bbox
        })
        xy.x += bbox.width
        text = text.slice(1)
      }
      if (text.length) {
        ctx.save()
        setStyle(ctx, props)
        const bbox = textBbox(ctx, text, xy.x, xy.y, props.fontSize, props.textAnchor)
        ctx.restore()
        arr.push({
          t: text,
          x: xy.x,
          y: xy.y,
          props,
          bbox
        })
        xy.x += bbox.width
        oldDxs.splice(0, text.length)
        oldDys.splice(0, text.length)
      }
    }
  }

  return arr
}

const setStyle = (ctx, {
  fontSize = 10,
  fontWeight = 'normal',
  fontFamily = 'sans-serif',
  textAnchor = 'start',
  fontStyle = 'normal',
  fill,
  socket,
  strokeWidth
}) => {
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

  ctx.textAlign =
    textAnchor === 'start'
      ? 'left'
      : textAnchor === 'middle'
        ? 'center'
        : 'right'
  if (notNoneVal(fill)) {
    ctx.fillStyle = fill
  }
  if (notNoneVal(socket)) {
    ctx.socketStyle = fill
  }
  if (strokeWidth) {
    ctx.lineWidth = +strokeWidth
  }
}

const textBbox = (ctx, text, x, y, fs = 10, textAnchor = 'start') => {
  const metrics = ctx.measureText(text)

  if (process.env.TARO_ENV === 'h5') {
    return {
      x: x - metrics.actualBoundingBoxLeft,
      y: y - metrics.actualBoundingBoxAscent,
      width: metrics.width,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    }
  } else {
    return {
      x: x - (textAnchor === 'middle' ? metrics.width / 2 : textAnchor === 'start' ? 0 : metrics.width),
      y,
      width: metrics.width,
      height: fs,
    }
  }
}
