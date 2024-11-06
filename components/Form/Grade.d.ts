import { SpaceProps } from '../Space'

/** 尺寸 */
interface size {
  /** s号 */
  s
  /** m号 */
  m
  /** l号 */
  l
}


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

interface GradeProps extends SpaceProps {
  /**
   * 当前评分值 1-5
   */
  value?: number
  /**
   * 默认值 1-5
   */
  defaultValue?: number
  /**
   * 值变化回调函数
   */
  onChange?: (value: number) => void
  /**
   * 图标尺寸
   */
  size?: keyof size
  /**
   * 图标颜色
   */
  type?: keyof type
  /**
   * 是否禁用
   */
  disabled?: boolean
}

export const Grade: React.FC<GradeProps>
