import { TouchableOpacity as RNTouchableOpacity } from 'react-native'

export const TouchableOpacity = ({ style, onClick, ...props }) => {
  return <RNTouchableOpacity
    style={style}
    {...props}
    {...onClick ? { onPress: onClick } : {}}
  />
}
