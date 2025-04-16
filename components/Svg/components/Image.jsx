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

Image.draw = (ctx, { href, x = 0, y = 0, width, height, preserveAspectRatio = 'xMidYMid meet' }, { canvas }) => {
  const img = imageManage.getImage(href, canvas)
  if (img instanceof Promise) {
    return { wait: img }
  }

  const imgWidth = img.width
  const imgHeight = img.height

  // 解析 preserveAspectRatio
  const [align, meetOrSlice] = preserveAspectRatio.split(' ')
  const isSlice = meetOrSlice === 'slice'

  // 计算缩放比例
  const scaleX = width / imgWidth
  const scaleY = height / imgHeight

  // 保持宽高比的统一缩放比例
  const scale = isSlice ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY)
  const scaledWidth = imgWidth * scale
  const scaledHeight = imgHeight * scale

  // 计算裁剪区域（仅 slice 模式需要）
  let sourceX = 0
  let sourceY = 0
  let sourceWidth = imgWidth
  let sourceHeight = imgHeight

  if (isSlice) {
    if (scale === scaleX) {
      // 图片高度超出，裁剪上下
      sourceHeight = height / scale
      if (align.includes('YMid')) {
        sourceY = (imgHeight - sourceHeight) / 2
      } else if (align.includes('YMax')) {
        sourceY = imgHeight - sourceHeight
      }
    } else {
      // 图片宽度超出，裁剪左右
      sourceWidth = width / scale
      if (align.includes('xMid')) {
        sourceX = (imgWidth - sourceWidth) / 2
      } else if (align.includes('xMax')) {
        sourceX = imgWidth - sourceWidth
      }
    }
  }

  // 计算目标绘制位置（居中对齐）
  const destX = x + (width - scaledWidth) / 2
  const destY = y + (height - scaledHeight) / 2

  // 绘制图片（带裁剪）
  ctx.drawImage(
    img,
    sourceX, sourceY, sourceWidth, sourceHeight, // 源裁剪区域
    isSlice ? x : destX, isSlice ? y : destY,    // 目标位置（slice 模式填满）
    isSlice ? width : scaledWidth,               // 目标宽度
    isSlice ? height : scaledHeight              // 目标高度
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
