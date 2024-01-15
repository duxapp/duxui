import { Image, View } from '@tarojs/components'
import classNames from 'classnames'
import empry from './images/empty.png'
import { Text } from '../Text'
import './index.scss'

export const Empty = ({
  url,
  icon,
  title = '什么都没有~',
  renderFooter,
  className,
  style,
  ...props
}) => {
  return <View
    className={classNames(
      'Empty',
      'items-center',
      className
    )}
    style={style}
    {...props}
  >
    {icon || <Image className='Empty__image' src={url || empry} />}
    <Text className='Empty__title' align='center' color={3}>{title}</Text>
    {renderFooter}
  </View>
}
