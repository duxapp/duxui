import { Component } from 'react'
import { nextTick, createSelectorQuery, getSystemInfoSync, canvasToTempFilePath } from '@tarojs/taro'
import { Canvas } from '@tarojs/components'
import { Layout } from '@/duxapp'
import classNames from 'classnames'
import { formConfig } from '../Form/config'

export class Sign extends Component {
  state = {
    width: 0,
    height: 0,
    show: false,
  }

  static key = 0

  // eslint-disable-next-line no-use-before-define
  canvasID = `ui-sign-${++Sign.key}`

  layout = res => {
    this.setState({
      width: res.width,
      height: res.height,
      show: true,
    }, () => {
      nextTick(() => {
        const query = createSelectorQuery()
        query.select(`#${this.canvasID}`)
          .fields({ node: true, size: true })
          .exec((_res) => {
            const canvas = _res[0].node
            const ctx = canvas.getContext('2d')

            if (process.env.TARO_ENV !== 'h5') {
              const dpr = getSystemInfoSync().pixelRatio
              canvas.width = _res[0].width * dpr
              canvas.height = _res[0].height * dpr
              ctx.scale(dpr, dpr)
            }

            this.ctx = ctx
            this.canvas = canvas

            const { color = '#333' } = this.props
            //设置线的颜色
            ctx.strokeStyle = color
            //设置线的宽度
            ctx.lineWidth = 5
            //设置线两端端点样式更加圆润
            ctx.lineCap = 'round'
            //设置两条线连接处更加圆润
            ctx.lineJoin = 'round'
          })
      })
    })
  }

  ctx = null
  touchs = []
  touchCount = 0

  getPos = e => {
    const touch = e.touches[0]
    if (process.env.TARO_ENV !== 'h5') {
      return {
        x: touch.x,
        y: touch.y
      }
    }
    const rect = e.target.getBoundingClientRect()
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }

  }

  touchStart = e => {
    e.preventDefault()
    this.touchs.push(this.getPos(e))
  }

  touchMove = e => {
    e.preventDefault()
    this.touchs.push(this.getPos(e))
    this.touchCount++
    if (this.touchs.length >= 2) {
      this.draw()
    }
  }

  touchEnd = e => {
    e.preventDefault()
    this.touchs.splice(0, this.touchs.length)
  }

  touchCancel = () => {
    this.touchs.splice(0, this.touchs.length)
  }

  draw() {
    const ctx = this.ctx
    if (!ctx) {
      return
    }
    const point1 = this.touchs[0]
    const point2 = this.touchs[1]

    // 删除第一个元素
    this.touchs.shift()
    ctx.moveTo(point1.x, point1.y)
    ctx.lineTo(point2.x, point2.y)
    ctx.stroke()
  }

  clear() {
    const ctx = this.ctx
    if (!ctx) {
      return
    }
    this.touchCount = 0
    ctx.clearRect(0, 0, this.state.width, this.state.height)
    ctx.beginPath()
  }

  async save() {

    if (this.touchCount < 30) {
      throw '笔画太少了'
    }

    const uploadTempFile = formConfig.getUploadTempFile('uploadTempFile')

    const res = await canvasToTempFilePath(
      {
        canvas: this.canvas,
        fileType: 'png'
      }
    )

    const [url] = await uploadTempFile([{ path: res.tempFilePath }])
    this.props.onChange?.(url)
    return url
  }

  render() {
    const { style, className, ...props } = this.props
    const { width, height, show } = this.state
    return (
      <Layout className={classNames('Sign', className)} style={style} {...props} onLayout={this.layout}>
        {show && (
          <Canvas
            type='2d'
            id={this.canvasID}
            style={{ width: width + 'px', height: height + 'px' }}
            onTouchStart={this.touchStart}
            onTouchMove={this.touchMove}
            onTouchEnd={this.touchEnd}
            onTouchCancel={this.touchCancel}
          />
        )}
      </Layout>
    )
  }
}
