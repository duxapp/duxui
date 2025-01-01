import { ReactElement } from 'react'

interface SvgToImageProps {
  /**
   * 子元素只能是 Svg 组件，否则无法获取截图
   */
  children: ReactElement
  /**
   * 截图参数
   */
  option?: {
    /**
     * 图片格式 默认png
     */
    format?: 'png' | 'jpg'
    /**
     * 图片质量 默认1
     */
    quality?: number
  }
}

export const SvgToImage: React.FC<SvgToImageProps> & {
  /**
   * 执行截图操作，异步返回图片的临时文件路径
   */
  capture(): Promise<{ tempFilePath: string }>
}
