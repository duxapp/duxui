import { ViewProps } from '@tarojs/components/types/View'
import { CSSProperties, ReactElement } from 'react'

interface StatusProps extends ViewProps {
  /** 横向位置 */
  horizontal?: 'left' | 'right'
  /** 竖向位置 */
  vertical?: 'top' | 'bottom'
  /** 要渲染的状态组件元素 */
  status?: ReactElement
}

interface StatusInclineProps extends ViewProps {
  /** 颜色类型 默认primary */
  type?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom1' | 'custom2' | 'custom3'
  /** 文本的样式 */
  textStyle?: CSSProperties
  /** 文本内容 */
  children: string
}

interface StatusCommonProps extends ViewProps {
  /** 颜色类型 默认primary */
  type?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom1' | 'custom2' | 'custom3'
  /** 尺寸 默认m */
  size?: 's' | 'm' | 'l'
  /** 显示内测的圆角 */
  radius?: boolean
  /** 文本的样式 */
  textStyle?: CSSProperties
  /** 文本内容 */
  children: string
}

/**
 * 在角落显示状态
 */
export const Status: React.FC<StatusProps>

export const StatusIncline: React.FC<StatusInclineProps>
export const StatusCommon: React.FC<StatusCommonProps>
