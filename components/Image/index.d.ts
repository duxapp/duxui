import { ImageProps as TaroImageProps } from '@tarojs/components'
import { ReactNode } from 'react'

interface ImageProps extends TaroImageProps {
  /** 点击图片时是否预览 */
  preview?: boolean
  /** 单图预览时的多图片 */
  images?: string[]
  /** 圆角类型 */
  radiusType?: 'square' | 'round-min'
  /**
   * 将图片显示为正方形
   * 传入数字可直接指定宽度
   * 如果传入true，需要通过其他方式指定图片宽度
   */
  square?: boolean | number
}

interface ImageGroupProps {
  /** 子元素 */
  children?: ReactNode
}

export const Image: React.FC<ImageProps>

export const ImageGroup: React.FC<ImageGroupProps>
