import classNames from 'classnames'
import { Text } from '@tarojs/components'
import { View } from '../common/View'
import { useStatusContext } from './util'
import './common.scss'

export const Incline = ({ children, type = 'primary', textStyle, style, className }) => {
  const { horizontal, vertical, className: statusClass } = useStatusContext()

  return <View style={style} className={classNames(statusClass, 'StatusIncline', 'StatusIncline--' + type, 'StatusIncline--' + vertical + '-' + horizontal, className)}>
    <Text className='StatusIncline__text' style={textStyle}>{children}</Text>
  </View>
}
