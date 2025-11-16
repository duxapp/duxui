import { ComponentType } from 'react'

interface SvgImageCropperCommon {
  /** 本地图片路径 */
  src: string
  /**
   * 图片格式 默认png
   */
  format?: 'png' | 'jpg'
  /**
   * 图片质量 默认1
   */
  quality?: number
}

interface SvgImageCropperProps extends SvgImageCropperCommon {
  /** 图片容器宽度 */
  width?: number
  /** 图片容器高度 */
  height?: number
}

interface SvgImageCropperOption extends SvgImageCropperCommon {
  /**
   * 裁剪比例
   * 默认 1:1
   * @example 1:1 19:9
   */
  cropScale?: string
}

export const SvgImageCropper: ComponentType<SvgImageCropperProps & {
  // 获取图片
  capture: () => Promise<{ tempFilePath: string }>
}>

export const svgImageCropper: (option: SvgImageCropperOption) => Promise<{ tempFilePath: string }>
