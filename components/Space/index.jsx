import classNames from 'classnames'
import { px } from '@/duxapp'
import { View } from '../common'
import './index.scss'

export const Space = ({
  children,
  size = 24,
  between,
  row,
  wrap,
  justify,
  items,
  grow,
  shrink,
  self,
  style,
  className,
  ...props
}) => {

  const _size = px(size)

  return <View
    className={classNames(
      justify && 'justify-' + justify,
      items && 'items-' + items,
      row && 'flex-row',
      wrap && 'flex-wrap',
      grow && 'w-0 flex-grow',
      shrink && 'flex-shrink',
      self && 'self-' + self,
      className
    )}
    style={{ ...style, gap: _size }}
    {...props}
  >
    {children}
  </View>
}
