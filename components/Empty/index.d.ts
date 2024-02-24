import { ReactNode } from 'react'

interface EmptyProps {
  /** 标题 */
  title?: string
  /** 图片链接 */
  url?: string
  /** 替换图片区域 */
  icon?: ReactNode
  /** 底部自定义渲染 */
  renderFooter?: ReactNode
  /** 自定义样式名 */
  className?: string
  /** 自定义样式 */
  style?: string
}

export const Empty: React.FC<EmptyProps>
