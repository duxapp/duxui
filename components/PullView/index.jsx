import { Component } from 'react'
import { View } from '@tarojs/components'
import { asyncTimeOut } from '@/duxapp'
import { Absolute } from '../Absolute'
import './index.scss'

export class PullView extends Component {

  state = {
    show: false
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        show: true
      })
    }, 10)
  }

  overlayCilck = () => {
    const { modal } = this.props
    if (modal) return
    this.close()
  }

  async close() {
    this.setState({
      show: false
    })
    await asyncTimeOut(200)
    this.props.onClose?.()
  }

  render() {
    const { show } = this.state
    const { side = 'bottom', style = {}, overlayOpacity = 0.5, children } = this.props
    return <Absolute>
      <View
        className='pull-view'
        style={{ backgroundColor: show ? `rgba(0, 0, 0, ${overlayOpacity})` : 'rgba(0, 0, 0, 0)' }}
        onClick={e => e.stopPropagation && e.stopPropagation()}
      >
        <View className='pull-view__other' onClick={this.overlayCilck}></View>
      </View>
      <View
        className={`pull-view__main pull-view__main--${side}${show ? ' pull-view__main--show' : ''}`}
        style={style}
      >
        {children}
      </View>
    </Absolute>
  }
}
