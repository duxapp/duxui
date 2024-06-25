import { ViewProps } from '@tarojs/components/types/View'
import { CSSProperties, ReactNode } from 'react'

interface StatusProps extends ViewProps {
  /** 横向位置 */
  horizontal?: 'left' | 'right'
  /** 竖向位置 */
  vertical?: 'top' | 'bottom'
  /** 要渲染的状态组件元素 */
  status?: ReactNode
}

interface StatusInclineProps {
  /** 颜色类型 默认primary */
  type?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom1' | 'custom2' | 'custom3'
  /** 文本的样式 */
  textStyle?: CSSProperties
  /** 样式 */
  style?: CSSProperties
  /** className */
  className?: string
  /** 子元素 */
  children?: ReactNode
}

interface StatusCommonProps {
  /** 颜色类型 默认primary */
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom1' | 'custom2' | 'custom3'
  /** 尺寸 默认s */
  size?: 's' | 'm' | 'l'
  /** 显示内测的圆角 */
  radius?: boolean
  /** 文本的样式 */
  textStyle?: CSSProperties
  /** 样式 */
  style?: CSSProperties
  /** className */
  className?: string
  /** 子元素 */
  children?: ReactNode
}

/**
 * 在角落显示状态
 */
export const Status: React.FC<StatusProps> & {
  Incline: React.FC<StatusInclineProps>
  Common: React.FC<StatusCommonProps>
}
