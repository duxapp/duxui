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

Image.draw = (ctx, { href, x = 0, y = 0, width, height,
  preserveAspectRatio = 'xMidYMid meet'
}, { canvas }) => {
  const img = imageManage.getImage(href, canvas)
  if (img instanceof Promise) {
    return {
      wait: img
    }
  } else {
    // 获取图片的实际宽高
    const imgWidth = img.width;
    const imgHeight = img.height;

    // 解析 preserveAspectRatio
    const [align, meetOrSlice] = preserveAspectRatio.split(' ')
    const isMeet = meetOrSlice !== 'slice'

    let scaleX = width / imgWidth
    let scaleY = height / imgHeight

    if (align !== 'none') {
      // 保持宽高比，根据 meetOrSlice 选择缩放方式
      const scale = isMeet
        ? Math.min(scaleX, scaleY)
        : Math.max(scaleX, scaleY)

      scaleX = scaleY = scale
    }

    // 计算对齐偏移
    let offsetX = 0
    let offsetY = 0

    if (align.includes('xMid')) {
      offsetX = (width - imgWidth * scaleX) / 2
    } else if (align.includes('xMax')) {
      offsetX = width - imgWidth * scaleX
    }

    if (align.includes('YMid')) {
      offsetY = (height - imgHeight * scaleY) / 2
    } else if (align.includes('YMax')) {
      offsetY = height - imgHeight * scaleY
    }

    // 绘制图片
    ctx.drawImage(
      img,
      0, 0, imgWidth, imgHeight, // 图片裁剪
      x + offsetX, y + offsetY, // 目标绘制位置
      imgWidth * scaleX, imgHeight * scaleY // 目标绘制大小
    )
  }
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
