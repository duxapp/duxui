import { Component } from 'react'
import Taro from '@tarojs/taro'
import { Canvas } from '@tarojs/components'
import { Layout } from '@/duxapp'
import { formConfig } from '../Form/config'
import './index.scss'

export class Sign extends Component {
  state = {
    width: 0,
    height: 0,
    show: false,
  }

  layout = (res) => {
    this.setState({
      width: res.width,
      height: res.height,
      show: true,
    })
  }

  sign = null
  touchs = []

  touchStart(e) {
    e.preventDefault()
    this.touchs.push({
      x: e.touches[0].x,
      y: e.touches[0].y,
    })
  }

  touchMove(e) {
    e.preventDefault()
    this.touchs.push({
      x: e.touches[0].x,
      y: e.touches[0].y,
    })
    if (this.touchs.length >= 2) {
      this.draw()
    }
  }

  touchEnd(e) {
    e.preventDefault()
    //清空轨迹数组
    this.touchs.length = 0
  }

  touchCancel() {
    //清空轨迹数组
    this.touchs.length = 0
  }

  draw() {
    if (this.sign === null) {
      const { color = '#333333' } = this.props
      this.sign = Taro.createCanvasContext(
        'sign',
        process.env.TARO_ENV === 'h5' ? this : this.$scope
      )
      //设置线的颜色
      this.sign.setStrokeStyle(color)
      //设置线的宽度
      this.sign.setLineWidth(5)
      //设置线两端端点样式更加圆润
      this.sign.setLineCap('round')
      //设置两条线连接处更加圆润
      this.sign.setLineJoin('round')
    }
    const point1 = this.touchs[0]
    const point2 = this.touchs[1]
    // 删除第一个元素
    this.touchs.shift()
    const sign = this.sign
    sign.moveTo(point1.x, point1.y)
    sign.lineTo(point2.x, point2.y)
    sign.stroke()
    sign.draw(true)
  }

  clear() {
    const sign = this.sign
    sign.clearRect(0, 0, this.state.width, this.state.height)
    sign.draw(true)
  }

  async save() {
    const res = await Taro.canvasToTempFilePath(
      {
        canvasId: 'sign',
      },
      this
    )
    const uploadTempFile = formConfig.getConfig('uploadTempFile')


    if (!uploadTempFile) {
      throw '请使用formConfig.setConfig 设置上传临时文件的函数: uploadTempFile'
    }
    const [url] = await uploadTempFile([{ path: res.tempFilePath }])
    this.props.onChange?.(url)
    return url
  }

  render() {
    const { style, tip = '请在屏幕范围内书写签名' } = this.props
    const { width, height, show } = this.state
    return (
      <Layout className='Sign' onLayout={this.layout}>
        {/* <View className='Sign__tip'>
          <Text className='Sign__tip__txt'>{tip}</Text>
        </View> */}

        {show && (
          <Canvas
            // type='2d'
            style={{ ...style, width: width + 'px', height: height + 'px' }}
            canvasId='sign'
            onTouchStart={this.touchStart.bind(this)}
            onTouchMove={this.touchMove.bind(this)}
            onTouchEnd={this.touchEnd.bind(this)}
            onTouchCancel={this.touchCancel.bind(this)}
          />
        )}
      </Layout>
    )
  }
}
