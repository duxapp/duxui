import { ReactNode } from 'react'
import { CommonEventFunction, ITouchEvent, TouchEvent } from '@tarojs/components/types/common'

interface CellProps {
  /** 左侧标题 */
  title?: ReactNode
  /** 左侧子标题 */
  subTitle?: ReactNode
  /** 右侧描述文字 */
  desc?: ReactNode
  /** 自定义左侧图标 */
  renderIcon?: ReactNode
  /** 是否展示右侧箭头，并可设置跳转链接 */
  isLink?: boolean | string
  /** 是否使用圆角 */
  radius?: string
  /** 单元格点击事件 */
  onClick?: CommonEventFunction<TouchEvent>
  /** 单元格长按事件 */
  onLongPress?: CommonEventFunction<TouchEvent>
  /** 自定义样式名 */
  className?: string
  /** 自定义样式 */
  style?: string
}

interface CellGroupProps {
  /** 是否显示分割线 */
  line?: boolean
  /** 是否使用圆角 */
  radius?: string
  /** 分组内容 */
  children?: ReactNode
  /** 自定义样式名 */
  className?: string
  /** 自定义样式 */
  style?: string
}

export const Cell: React.FC<CellProps> & {
  /** 单元格分组 */
  Group: React.FC<CellGroupProps>
}
