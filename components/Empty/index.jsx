import { Image, View } from '@tarojs/components'
import classNames from 'classnames'
import { duxuiLang } from '@/duxui/utils'
import empry from './images/empty.png'
import { Text } from '../Text'
import './index.scss'

export const Empty = ({
  url,
  renderIcon,
  title,
  renderFooter,
  className,
  style,
  ...props
}) => {
  const t = duxuiLang.useT()
  const titleText = title ?? t('empty.title')
  return <View
    className={classNames(
      'Empty',
      'items-center',
      className
    )}
    style={style}
    {...props}
  >
    {renderIcon || <Image className='Empty__image' src={url || empry} />}
    <Text className='Empty__title' align='center' color={3}>{titleText}</Text>
    {renderFooter}
  </View>
}
