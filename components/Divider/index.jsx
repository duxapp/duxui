import { View } from '@tarojs/components'
import { px } from '@/duxapp'
import { useMemo, Children, isValidElement } from 'react'
import classNames from 'classnames'
import './index.scss'

const Horizontal = ({ size, type, self, color, className, style, ...props }) => {

  const style1 = useMemo(() => {
    const _styles = {}
    if (size) {
      _styles.borderTopWidth = px(size)
    }
    if (type) {
      _styles.borderStyle = type
    }
    return _styles
  }, [size, type])

  return <View
    className={classNames(
      'Divider-Horizontal',
      self && ('self-' + self),
      color && ('Divider--' + color),
      className
    )}
    style={{ ...style1, ...style }}
    {...props}
  />
}

const Vertical = ({ size, type, self = 'stretch', color, className, style, ...props }) => {
  const style1 = useMemo(() => {
    const _styles = {}
    if (size) {
      _styles.borderLeftWidth = px(size)
    }
    if (type) {
      _styles.borderStyle = type
    }
    return _styles
  }, [size, type])

  return <View
    className={classNames(
      'Divider-Vertical',
      self && ('self-' + self),
      color && ('Divider--' + color),
      className
    )}
    style={{ ...style1, ...style }}
    {...props}
  />
}

export const Divider = ({
  direction = 'horizontal',
  vertical,
  ...props
}) => {
  return direction === 'horizontal' && !vertical
    ? <Horizontal {...props} />
    : <Vertical {...props} />
}


const DividerGroup = ({
  vertical,
  children,
  ...props
}) => {
  return Children.map(children, (child, index) => {
    return <>
      {index > 0 && isValidElement(child) && <>
        {
          vertical
            ? <Vertical {...props} />
            : <Horizontal {...props} />
        }
      </>}
      {child}
    </>
  })
}

Divider.Group = DividerGroup
