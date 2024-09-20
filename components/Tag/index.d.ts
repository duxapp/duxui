import { RowProps } from '../Flex'

interface TagProps extends RowProps {
  /** 标签类型 */
  type?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom1' | 'custom2' | 'custom3'
  /** 标签大小 */
  size?: 's' | 'm' | 'l'
  /** 标签颜色 */
  color?: string
  /** 文字颜色 */
  texColor?: string
  /** 是否是空心标签 */
  plain?: boolean
  /** 圆角类型 */
  radiusType?: 'square' | 'round' | 'round-min'
}

export const Tag: React.FC<TagProps>
