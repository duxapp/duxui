import React from 'react'
import { PixelRatio, ScrollView, StyleSheet, Text, View } from 'react-native'
import PickerMixin from './PickerMixin'
import { PickerProps } from './PickerTypes'

const ratio = PixelRatio.get()
const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    left: 0,
    top: -99,
    borderColor: '#e2e2e2',
    borderTopWidth: 1 / ratio,
    borderBottomWidth: 1 / ratio,
  } as any,

  scrollView: {
    height: 0,
  },

  selectedItemText: {
    color: '#404040',
  } as any,

  itemText: {
    fontSize: 18,
    color: '#c2c2c2',
    textAlign: 'center',
    paddingTop: 3,
    paddingBottom: 3
  } as any,
})

export interface IPickerProp {
  select: Function
  doScrollingComplete: Function
}

class Picker extends React.Component<IPickerProp & PickerProps, any> {
  itemHeight: number
  itemWidth: number
  scrollBuffer: number
  scrollerRef: ScrollView | null

  state = {
    indicatorStyle: {},
    scrollerStyle: {},
    contentStyle: {}
  }

  onItemLayout = (e: any) => {
    const { height, width } = e.nativeEvent.layout
    // console.log('onItemLayout', height);
    if (this.itemHeight !== height || this.itemWidth !== width) {
      this.itemWidth = width
      this.setState({
        indicatorStyle: {
          top: height * 3,
          height,
          width,
        }
      })
    }
    if (this.itemHeight !== height) {
      this.itemHeight = height
      this.setState({
        contentStyle: {
          paddingTop: height * 3,
          paddingBottom: height * 3,
        },
        scrollerStyle: {
          height: height * 7,
        }
      })

      // i do no know why!...
      setTimeout(() => {
        this.props.select(
          this.props.selectedValue,
          this.itemHeight,
          this.scrollTo,
        )
      }, 0)
    }
  }

  componentDidUpdate() {
    this.props.select(this.props.selectedValue, this.itemHeight, this.scrollTo)
  }

  componentWillUnmount() {
    this.clearScrollBuffer()
  }

  clearScrollBuffer() {
    if (this.scrollBuffer) {
      clearTimeout(this.scrollBuffer)
    }
  }

  scrollTo = (y: any) => {
    if (this.scrollerRef) {
      this.scrollerRef.scrollTo({
        y,
        animated: false,
      })
    }
  }

  fireValueChange = (selectedValue: any) => {
    if (
      this.props.selectedValue !== selectedValue &&
      this.props.onValueChange
    ) {
      this.props.onValueChange(selectedValue)
    }
  }

  onScroll = (e: any) => {
    const { y } = e.nativeEvent.contentOffset
    this.clearScrollBuffer()
    this.scrollBuffer = setTimeout(() => {
      this.clearScrollBuffer()
      this.props.doScrollingComplete(y, this.itemHeight, this.fireValueChange)
    }, 50) as any
  }

  render() {
    const { children, itemStyle, selectedValue, style } = this.props
    const { indicatorStyle, scrollerStyle, contentStyle } = this.state
    const items = React.Children.map(children, (item: any, index) => {
      const totalStyle = [styles.itemText]
      if (selectedValue === item.props.value) {
        totalStyle.push(styles.selectedItemText)
      }
      return (
        <View
          ref={(el) => ((this as any)[`item${index}`] = el)}
          onLayout={index === 0 ? this.onItemLayout : undefined}
          key={item.key}>
          <Text
            style={[{ includeFontPadding: false }, totalStyle, itemStyle]}
            numberOfLines={1}>
            {item.props.label}
          </Text>
        </View>
      )
    })
    return (
      <View style={style}>
        <View style={[styles.indicator, indicatorStyle]} />
        <ScrollView
          style={[styles.scrollView, scrollerStyle]}
          ref={(el) => (this.scrollerRef = el)}
          onScroll={this.onScroll}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          renderToHardwareTextureAndroid
          scrollEventThrottle={10}
          needsOffscreenAlphaCompositing
          collapsable
          horizontal={false}
          nestedScrollEnabled
          removeClippedSubviews>
          <View style={contentStyle}>{items}</View>
        </ScrollView>
      </View>
    )
  }
}

export default PickerMixin(Picker)
