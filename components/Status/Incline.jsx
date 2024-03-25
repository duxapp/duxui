import classNames from 'classnames'
import { Text } from '@tarojs/components'
import { View } from '../common/View'
import { useStatusContext } from './util'
import './common.scss'

export const Incline = ({ children, type = 'primary', textStyle, style, className, ...props }) => {
  const { horizontal, vertical } = useStatusContext()

  return <View style={style}
    className={classNames('absolute StatusIncline', 'StatusIncline--' + type, 'StatusIncline--' + vertical + '-' + horizontal, className)}
    {...props}
  >
    <Text className='StatusIncline__text' style={textStyle}>{children}</Text>
  </View>
}
