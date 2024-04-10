import { ColumnProps } from '../Flex'

interface TouchableOpacityProps extends ColumnProps {
  /** 点击时候的不透明度 0-1 */
  activeOpacity?: number
}

export const TouchableOpacity: React.FC<TouchableOpacityProps>
