interface UploadImagesProps {
  /**
   * 图片地址
   */
  value?: string[]
  /**
   * 操作值回调
   */
  onChange?: (value: string[]) => void
  /**
   * 每行显示多少图片
   * 默认4
   */
  column?: number
  /**
   * 添加图片文本
   * 默认 添加图片
   */
  addText?: string
  /**
   * 最多允许上传多少图片
   * 默认 9
   */
  max?: number
  /** 是否禁用 */
  disabled?: boolean
}

interface UploadImageProps {
  /**
   * 图片地址
   */
  value?: string
  /**
   * 操作值回调
   */
  onChange?: (value: string) => void
  /**
   * 添加图片文本
   * 默认 添加图片
   */
  addText?: string
  /** 是否禁用 */
  disabled?: boolean
}

export const UploadImages: React.FC<UploadImagesProps>
export const UploadImage: React.FC<UploadImageProps>
