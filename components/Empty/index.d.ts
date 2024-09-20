import { ReactElement } from 'react'
import { ViewProps } from '@tarojs/components'

interface EmptyProps extends ViewProps {
  /** 标题 */
  title?: string
  /** 用于替换默认的图片 */
  url?: string
  /** 替换图片区域 */
  renderIcon?: ReactElement
  /** 底部自定义渲染 */
  renderFooter?: ReactElement
}

export const Empty: React.FC<EmptyProps>
