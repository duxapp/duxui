import { Upload } from '../../../duxapp/utils/net'
import { GridProps } from '../Grid'

interface RecorderProps extends GridProps {
  /**
   * 音频地址
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
   * 每行显示多少
   * 默认4
   */
  column?: number
  /**
   * 最多允许录制多少音频
   * 默认 1
   * 传入 1 相当于单个录制，value是字符串类型，大于1是多个录制，value是数组类型
   */
  max?: number
  /** 是否禁用 */
  disabled?: boolean
  /**
   * 录制提示文本
   */
  tip?: string
  /** 传递给上传临时文件函数的选项 */
  option?: Upload.Option
}

/**
 * 音频录制表单
 */
export const Recorder: React.FC<RecorderProps> & {

  /**
   * 弹出音频录制功能，异步返回录制的值
   */
  start: () => Promise<{
    /**
     * 临时文件位置
     */
    path: string
    /**
     * 录音大小
     */
    size: number
    /**
     * 录音时长 ms
     */
    duration: number
  }>
}
