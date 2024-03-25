import { ReactNode, CSSProperties } from 'react'

type AvatarSize = 's' | 'm' | 'l'

type AvatarRadiusType = 'square' | 'round' | 'round-min'

interface AvatarProps {
  /** 尺寸，默认为 "medium" */
  size?: AvatarSize
  /** 头像边框类型，默认为 "round" */
  radiusType?: AvatarRadiusType
  /** 头像颜色 */
  color?: string
  /** 头像背景颜色 */
  bgColor?: string
  /** 头像图片地址 */
  url?: string
  /** 头像图标，可以是任何支持的 React 组件 */
  icon?: ReactNode
  /** 头像图标尺寸 */
  iconSize?: number
  /** 添加类名 */
  className?: string
  /** 添加样式 */
  style?: React.CSSProperties
  /** 子元素 */
  children?: ReactNode
}

interface AvatarGroupProps {
  /** 尺寸，默认为 "medium" */
  size?: AvatarSize
  /** 头像边框类型，默认为 "round" */
  radiusType?: AvatarRadiusType
  /** 头像颜色 */
  color?: string
  /** 头像背景颜色 */
  bgColor?: string
  /** 头像图标尺寸 */
  iconSize?: number
  /** 子元素 */
  children?: ReactNode
  /** 头像之间的距离，默认为 -16px */
  span?: number
  /** 最大头像数量，超出部分用 "+" 显示 */
  max?: number
  /** 当头像数量超出时，用于替代超出部分的头像 */
  maxProps?: Omit<AvatarProps, 'children'>
  /** 添加类名 */
  className?: string
  /** 添加样式 */
  style?: React.CSSProperties
}

export const Avatar: React.FC<AvatarProps> & {
  Group: React.FC<AvatarGroupProps>
}
