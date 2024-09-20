import { Component, createRef } from 'react'
import Svg, { Path } from 'react-native-svg'
import ViewShot, { captureRef } from 'react-native-view-shot'
import { View } from '@tarojs/components'
import { PanResponder } from 'react-native'
import { formConfig } from '../Form/config'
// import './index.scss'

// 这两个是为了写字板样式若是有什么边距问题，有padding或margin的加上去，以屏幕手势起始点开始，如果没有边距问题都赋值为0就好
// let marginY = 100 //头部导航height 50
// let marginX = 70 // 图片与父盒子距离 0

export class Sign extends Component {
  constructor(props) {
    super(props)
    this.allPathPointsAsign = '' //所有点的合并
    this.allPathPointsList = [] //所有路径点数组、用来操作撤销
    this.state = {
      /**画笔**/
      drawPath: '',

      /**规格**/
      size_id: 0,
      color_id: 0,
      currentSize: '3', //默认线条粗细
      currentColor: '#000000', //默认线条颜色

      /**所有操作集合数组**/
      myAllList: [],

      isDrawing: false,
      drawType: 4,
    }
    this.viewShotRef = createRef()
  }

  componentWillMount() {
    this._panResponderDrawLine = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) =>
        this._onPanResponderGrant(evt, gestureState),

      onPanResponderMove: (evt, gestureState) =>
        this._onPanResponderMove(evt, gestureState),

      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderRelease: (evt, gestureState) =>
        this._onPanResponderRelease(evt, gestureState),

      onPanResponderTerminate: (evt, gestureState) => { },

      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })
  }

  touchCount = 0

  _onPanResponderGrant(evt, gestureState) {
    let drawType = this.state.drawType
    this.setState({
      isDrawing: true,
    })
    /**画线**/
    if (drawType === 4) {
      // console.log('手指开始接触====')
      // let tempfirstX = evt.nativeEvent.pageX - marginX
      // let tempFirstY = evt.nativeEvent.pageY - marginY
      let tempfirstX = evt.nativeEvent.locationX
      let tempFirstY = evt.nativeEvent.locationY
      this.firstPoint = `M${tempfirstX},${tempFirstY}L`
      this.allPathPointsAsign = this.firstPoint
    }
  }

  _onPanResponderMove(evt, gestureState) {
    let drawType = this.state.drawType
    // console.log('手指移动中')

    this.touchCount++

    /**画线**/
    if (drawType === 4) {
      // console.log(evt.nativeEvent.pageX ,'==============')
      // let pointX = evt.nativeEvent.locationX
      // let pointY = evt.nativeEvent.locationY
      let pointX = evt.nativeEvent.locationX
      let pointY = evt.nativeEvent.locationY
      let point = `${this.allPathPointsAsign.endsWith('L') ? '' : ','}${pointX},${pointY}`
      this.allPathPointsAsign += point
      let drawPath = this.allPathPointsAsign //一次性画了之后存到一个数组，目的是为了后面的撤销操作

      this.setState({
        drawPath,
      })
    }
  }

  _onPanResponderRelease(evt, gestureState) {
    // console.log('手指离开')
    let drawType = this.state.drawType
    this.setState({
      isDrawing: false,
    })
    /**画线**/
    if (drawType === 4) {
      let obj = {
        size_id: this.state.size_id,
        color_id: this.state.color_id,
        path: this.allPathPointsAsign,
        pathType: 'line',
      }
      this.allPathPointsList.push(obj) //将所有画过的线以及他的粗细、颜色等保存起来
      this.setState({
        myAllList: this.allPathPointsList,
      })
    }
  }

  //撤销
  revoke() {
    this.allPathPointsList.pop(1)
    this.setState({
      drawPath: '', //这是清除已经刚刚画好的
      myAllList: this.allPathPointsList,
    })
  }

  //清空
  clear() {
    this.allPathPointsList = []
    this.setState({
      drawPath: '', //这是清除已经刚刚画好的
      myAllList: [],
    })
    this.touchCount = 0
  }

  //保存画板内容
  async save() {
    // this.viewShotRef.capture().then(uri => {
    //   console.log('do something with ', uri)
    // })
    // captureRef(this.viewShotRef, {
    //   format: 'png',
    //   quality: 1
    // }).then(uri => {
    //   console.log('这是需要保存的图片', uri)
    // }
    // ).catch(err => {
    //   console.error('截取图片失败', err)
    // })
    if (this.touchCount < 30) {
      throw '笔画太少了'
    }
    const uploadTempFile = formConfig.getUploadTempFile('uploadTempFile')

    const uri = await captureRef(this.viewShotRef, {
      format: 'png',
      quality: 1,
    })
    const [url] = await uploadTempFile([{ path: uri }])

    this.props.onChange?.(url)

    return url
  }

  // renderBottom() {
  //   return (
  //     <View className='camera_bottom'>
  //       <View className='bottom_item' style={{ flex: 2, borderRightWidth: 0 }}>
  //         <Text className='bottom_title'>操作</Text>
  //         <View className='bottom_icon'>
  //           <View
  //             className='bottom_btn'
  //             onClick={() => this.revoke()}
  //             style={{ fontSize: 12 }}
  //           >
  //             撤销
  //           </View>
  //           <View
  //             className='bottom_btn'
  //             onClick={() => this.clearOut()}
  //             style={{ fontSize: 12 }}
  //           >
  //             清空
  //           </View>
  //           <View
  //             className='bottom_btn'
  //             onClick={() => this.savePhoto()}
  //             style={{
  //               color: '#fff',
  //               fontSize: 12,
  //               backgroundColor: '#203990',
  //             }}
  //           >
  //             保存
  //           </View>
  //         </View>
  //       </View>
  //     </View>
  //   )
  // }

  render() {

    const { style } = this.props

    const { drawType, isDrawing } = this.state

    return (
      <ViewShot
        options={{ format: 'png', quality: 1.0 }}
        style={style}
      >
        <View
          className='viewshotbg'
          ref={this.viewShotRef}
          style={{ flex: 1 }}
          {...this._panResponderDrawLine.panHandlers}
        >
          <Svg height='100%' width='100%'>
            {
              this.state.myAllList.map((item, id) => {
                return (
                  <Path
                    key={id}
                    d={item.path}
                    fill='none'
                    strokeLinecap='round'
                    stroke={this.state.currentColor}
                    strokeWidth={this.state.currentSize}
                  />
                )
              })
            }
            {drawType === 4 && isDrawing && (
              <Path
                d={this.state.drawPath}
                fill='none'
                strokeLinecap='round'
                stroke={this.state.currentColor}
                strokeWidth={this.state.currentSize}
              />
            )}
          </Svg>
        </View>
      </ViewShot>
    )
  }
}
