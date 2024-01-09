import { ImageProps } from '@tarojs/components/types/Image'
import { ReactNode } from 'react'

interface UIImageProps extends ImageProps {
  /** 图片地址 */
  src: string
  /** 点击图片时是否预览 */
  preview?: boolean
  /** 单图预览时的多图片 */
  images?: string[]
  /** 圆角类型 */
  radiusType?: 'square' | 'round-min'
  /** 将图片显示为正方形，需要指定 width 属性 */
  square?: boolean
  /** 点击图片时的回调函数 */
  onClick?: (e: any) => void
}

interface ImageGroupProps {
  /** 子元素 */
  children?: ReactNode
}

export const Image: React.FC<UIImageProps> & {
  Group: React.FC<ImageGroupProps>
}
