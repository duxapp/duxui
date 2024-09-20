import { ReactElement } from 'react'
import { ViewProps } from '@tarojs/components'

type AvatarSize = 's' | 'm' | 'l'

type AvatarRadiusType = 'square' | 'round' | 'round-min'

interface AvatarProps extends ViewProps {
  /** 尺寸，默认为 "m" */
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
  icon?: ReactElement
  /** 头像图标尺寸 */
  iconSize?: number
  /** 子元素 需要传入文本 */
  children?: ReactElement
}

interface AvatarGroupProps extends ViewProps {
  /** 尺寸，默认为 "m" */
  size?: AvatarSize
  /** 头像边框类型，默认为 "round" */
  radiusType?: AvatarRadiusType
  /** 头像颜色 */
  color?: string
  /** 头像背景颜色 */
  bgColor?: string
  /** 头像图标尺寸 */
  iconSize?: number
  /** 子元素，放入多个Avatar */
  children?: ReactElement
  /** 头像之间的距离，默认为 -16 */
  span?: number
  /** 最大头像数量，超出部分用 "+" 显示 */
  max?: number
  /** 当头像数量超出时，用于替代超出部分的头像 */
  maxProps?: Omit<AvatarProps, 'children'>
}

export const Avatar: React.FC<AvatarProps> & {
  Group: React.FC<AvatarGroupProps>
}
