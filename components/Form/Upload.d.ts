import { Upload } from '../../../duxapp/utils/net'
import { GridProps } from '../Grid'

interface UploadProps extends GridProps {
  /**
   * 上传媒体类型
   */
  type: 'image' | 'video' | 'all'
  /**
   * 最多允许上传多少图片
   * 默认 1
   * 传入 1 相当于单个上传，value是字符串类型，大于1是多个上传，value是数组类型
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
  /**
   * 默认值
   */
  defaultValue?: string | string[]
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
  /** 是否禁用 */
  disabled?: boolean
  /** 传递给上传函数的选项 */
  option?: Upload.Option
}

export const Upload: React.FC<UploadProps>
