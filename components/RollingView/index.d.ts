import { ReactElement } from 'react'
import { ViewProps } from '@tarojs/components'

interface RollingViewProps extends ViewProps {
  /**
   * 滚动一屏需要的时长
   * 默认 5000
   */
  duration?: number
  /**
   * 是否垂直方向滚动
   */
  vertical?: boolean
}


export const RollingView: React.FC<RollingViewProps>
