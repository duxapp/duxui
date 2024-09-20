import { Upload } from '../../../duxapp/utils/net'
import { GridProps } from '../Grid'

interface UploadImagesProps extends GridProps {
  /**
   * 上传媒体类型
   */
  type: 'image' | 'video' | 'all'
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
  /** 传递给上传函数的选项 */
  option?: Upload.Option
}

interface UploadProps extends UploadImagesProps {
  /**
   * 最多允许上传多少图片
   * 默认 1
   * 传入 1 箱单于单个上传，value是字符串类型，大于1是多个上传，value是数组类型
   */
  max?: number
  /**
   * 值
   */
  value?: string | string[]
  /**
   * 操作值回调
   */
  onChange?: (value: string | string[]) => void
}

export const Upload: React.FC<UploadProps>
