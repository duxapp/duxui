import { calculateAspectRatioFit } from './Common'

export const Image = () => {

  return null
}

Image.displayName = 'DuxSvgImage'

Image.bbox = ({ x = 0, y = 0, width, height }) => {
  return {
    x, y, width, height
  }
}

Image.range = (touch, { x = 0, y = 0, width, height }) => {
  return touch.x >= x && touch.x <= x + width
    && touch.y >= y && touch.y <= y + height
}

Image.draw = (ctx, { href, x = 0, y = 0, width, height, preserveAspectRatio }, { canvas }) => {
  const img = imageManage.getImage(href, canvas)
  if (img instanceof Promise) {
    return { wait: img }
  }

  const params = calculateAspectRatioFit({
    contentWidth: img.width,
    contentHeight: img.height,
    containerWidth: width,
    containerHeight: height,
    preserveAspectRatio,
    isImage: true
  })

  // 绘制图片（带裁剪）
  ctx.drawImage(
    img,
    params.sourceX, params.sourceY, params.sourceWidth, params.sourceHeight,
    x + params.offsetX,
    y + params.offsetY,
    params.destWidth,
    params.destHeight
  )
}

const imageManage = {
  cache: {},
  getImage(href, canvas) {
    const uri = typeof href === 'string' ? href : href?.uri
    if (uri && this.cache[uri]) {
      return this.cache[uri]
    } else if (uri) {
      this.cache[uri] = load(canvas, uri).then(img => {
        this.cache[uri] = img
      })
      return this.cache[uri]
    } else {
      throw new Error('无效的图片路径')
    }
  }
}

const load = async (canvas, src) => {
  const img = process.env.TARO_ENV === 'h5' ? h5CreateImage() : canvas.createImage()
  await new Promise((resolve, reject) => {
    img.src = src
    img.onload = resolve
    img.onerror = reject
  })
  return img
}

const h5CreateImage = process.env.TARO_ENV === 'h5' ? () => {
  const img = new window.Image()
  img.crossOrigin = 'Anonymous'
  return img
} : null
