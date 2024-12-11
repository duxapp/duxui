import { RowProps } from '../Flex'

interface type {
  /** 主色 */
  primary
  /** 辅色 */
  secondary
  /** 成功 */
  success
  /** 错误 */
  danger
  /** 警告 */
  warning
}

interface InputNumberProps extends RowProps {
  /**
   * 音频地址
   */
  value?: number
  /**
   * 操作值回调
   */
  onChange?: (value: number) => void
  /**
   * 默认值
   */
  defaultValue?: number
  /**
   * 步长，默认 1
   */
  step?: number
  /**
   * 是否开启手动输入
   */
  input?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 最大值
   */
  max?: number
  /**
   * 最小值
   */
  min?: number
  /**
   * 颜色
   */
  type?: keyof type
}

/**
 * 音频录制表单
 */
export const InputNumber: React.FC<InputNumberProps>
