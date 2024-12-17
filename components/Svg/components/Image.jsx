export const Image = () => {

  return null
}

Image.draw = (ctx, { x, y, width, height, href, opacity }, { canvas }) => {
  const img = imageManage.getImage(href, canvas)
  if (img instanceof Promise) {
    return {
      wait: img
    }
  } else {
    ctx.drawImage(
      img,
      // cropX, cropY, cropWidth, cropHeight,
      x, y, width, height
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
  const img = canvas.createImage()
  await new Promise((resolve, reject) => {
    img.src = src
    img.onload = resolve
    img.onerror = reject
  })
  return img
}
