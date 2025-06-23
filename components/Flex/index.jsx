import classNames from 'classnames'
import { View } from '../common'

export const Row = ({
  wrap,
  justify,
  items,
  grow,
  shrink,
  self,
  className,
  style,
  ...props
}) => {
  return <View
    className={classNames(
      'flex-row',
      wrap && 'flex-wrap',
      justify && 'justify-' + justify,
      items && 'items-' + items,
      grow && 'flex-grow',
      shrink && 'flex-shrink',
      self && 'self-' + self,
      className
    )}
    style={style}
    {...props}
  />
}

export const Column = ({
  justify,
  items,
  grow,
  shrink,
  self,
  className,
  style,
  ...props
}) => {
  return <View
    className={classNames(
      justify && 'justify-' + justify,
      items && 'items-' + items,
      grow && 'flex-grow',
      shrink && 'flex-shrink',
      self && 'self-' + self,
      className
    )}
    style={style}
    {...props}
  />
}
