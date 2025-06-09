import classNames from 'classnames'
import { View } from '../common/View'
import { Text } from '../Text'
import { useStatusContext } from './util'
import './common.scss'

export const StatusCommon = ({ children, type = 'primary', size = 'm', radius, textStyle, style, className, ...props }) => {
  const { horizontal, vertical, className: statusClass } = useStatusContext()

  return <View style={style}
    className={classNames(statusClass, 'StatusCommon', 'StatusCommon--' + type, 'StatusCommon--' + size, radius && ('StatusCommon--' + vertical + '-' + horizontal), className)}
    {...props}
  >
    <Text type={type} size={textSizes[size]} style={textStyle}>{children}</Text>
  </View>
}

const textSizes = { s: 1, m: 2, l: 3 }
