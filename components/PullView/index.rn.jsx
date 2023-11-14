import { Component } from 'react'
import { View } from '@tarojs/components'
import { Animated, StyleSheet } from 'react-native'
import { Absolute } from '../Absolute'
import './index.scss'

export class PullView extends Component {

  constructor(...props) {
    super(...props)
    this.state.animationRoot = new Animated.Value(0)
    this.state.styleRn = StyleSheet.create({
      position: {},
      other: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent'
      },
    })
  }

  state = {
    animationRoot: null,
    styleRn: null
  }

  componentDidMount() {
    const { side = 'bottom' } = this.props
    const position = {}
    // RN端动画
    setTimeout(() => {
      const { animationRoot } = this.state
      switch (side) {
        case 'left':
          position.top = 0
          position.bottom = 0
          break
        case 'right':
          position.top = 0
          position.bottom = 0
          break
        case 'top':
          position.left = 0
          position.right = 0
          break
        case 'bottom':
          position.left = 0
          position.right = 0
          break
      }

      this.setState({
        styleRn: StyleSheet.create({
          position
        })
      })
      Animated.timing(
        animationRoot,
        {
          toValue: 1,
          duration: this.animatedTime,
          useNativeDriver: false
        }
      ).start()
    }, 20)
  }

  // 动画时间
  animatedTime = 200

  overlayCilck() {
    const { modal } = this.props
    if (modal) return
    this.close()
  }

  close() {
    const { animationRoot } = this.state
    Animated.timing(
      animationRoot,
      {
        toValue: 0,
        duration: this.animatedTime,
        useNativeDriver: false
      }
    ).start()
    setTimeout(() => this.props.onClose && this.props.onClose(), this.animatedTime)
  }

  render() {
    const { animationRoot, styleRn } = this.state
    const { side = 'bottom', style = {}, overlayOpacity = 0.5 } = this.props

    return <Absolute>
      <Animated.View
        className='pull-view'
        style={{
          backgroundColor: animationRoot.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', `rgba(0, 0, 0, ${overlayOpacity})`]
          })
        }}
      >
        <View className='pull-view__other' onClick={this.overlayCilck.bind(this)}></View>
      </Animated.View>
      <Animated.View
        className='pull-view__main'
        style={{
          ...styleRn.position,
          ...style,
          ...{
            opacity: animationRoot.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            }),
            [side]: animationRoot.interpolate({
              inputRange: [0, 1],
              outputRange: [-200, 0]
            })
          }
        }}
      >
        {this.props.children}
      </Animated.View>
    </Absolute>
  }
}
