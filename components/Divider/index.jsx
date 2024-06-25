import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, Children } from 'react'
import classNames from 'classnames'
import './index.scss'

const Horizontal = ({ size, padding, type, className, style }) => {

  const [style1, style2] = useMemo(() => {
    const styles = [{}, {}]
    if (typeof padding === 'number') {
      const _padding = Taro.pxTransform(padding)
      styles[0].paddingTop = _padding
      styles[0].paddingBottom = _padding
    }
    if (size) {
      styles[1].borderTopWidth = Taro.pxTransform(size)
    }
    if (type) {
      styles[1].borderStyle = type
    }
    return styles
  }, [padding, size, type])

  return <View className={classNames('DividerHorizontal', className)} style={{ ...style1, ...style }}>
    <View className={classNames('DividerHorizontal__child', 'DividerHorizontal__child--' + type)} style={style2} />
  </View>
}

const Vertical = ({ size, padding, type, className, style }) => {
  const [style1, style2] = useMemo(() => {
    const styles = [{}, {}]
    if (typeof padding === 'number') {
      const _padding = Taro.pxTransform(padding)
      styles[0].paddingLeft = _padding
      styles[0].paddingRight = _padding
    }
    if (size) {
      styles[1].borderLeftWidth = Taro.pxTransform(size)
    }
    if (type) {
      styles[1].borderStyle = type
    }
    return styles
  }, [padding, size, type])

  return <View className={classNames('DividerVertical', className)} style={{ ...style1, ...style }}>
    <View className={classNames('DividerVertical__child', 'DividerVertical__child--' + type)} style={style2} />
  </View>
}

export const Divider = ({
  direction = 'horizontal',
  ...props
}) => {
  return direction === 'horizontal'
    ? <Horizontal {...props} />
    : <Vertical {...props} />
}


const DividerGroup = ({
  row,
  children,
  ...props
}) => {
  return Children.map(children, (child, index) => {
    return <>
      {index > 0 && <>
        {
          row
            ? <Vertical {...props} />
            : <Horizontal {...props} />
        }
      </>}
      {child}
    </>
  })
}

Divider.Group = DividerGroup
