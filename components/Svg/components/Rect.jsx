import { notNoneVal } from './Common'

export const Rect = () => {
  return null
}

Rect.displayName = 'DuxSvgRect'

Rect.bbox = ({ x = 0, y = 0, width, height }) => {
  return {
    x,
    y,
    width,
    height
  }
}

Rect.range = (touch, { x = 0, y = 0, width, height }) => {
  return touch.x >= x && touch.x <= x + width
    && touch.y >= y && touch.y <= y + height
}

Rect.draw = (ctx, { x = 0, y = 0, width, height, rx = 0, ry = 0, fill, stroke }) => {

  rx = Math.min(rx, width / 2)
  ry = Math.min(ry, height / 2)

  // 绘制带圆角的路径
  ctx.beginPath()
  ctx.moveTo(x + rx, y)
  ctx.lineTo(x + width - rx, y) // 顶边
  ctx.quadraticCurveTo(x + width, y, x + width, y + ry) // 右上角
  ctx.lineTo(x + width, y + height - ry) // 右边
  ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height) // 右下角
  ctx.lineTo(x + rx, y + height) // 底边
  ctx.quadraticCurveTo(x, y + height, x, y + height - ry) // 左下角
  ctx.lineTo(x, y + ry) // 左边
  ctx.quadraticCurveTo(x, y, x + rx, y) // 左上角
  ctx.closePath()

  if (notNoneVal(fill)) {
    ctx.fill()
  }
  if (notNoneVal(stroke)) {
    ctx.stroke()
  }
}
