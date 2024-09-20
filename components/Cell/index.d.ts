import { ReactElement } from 'react'
import { ViewProps } from '@tarojs/components'
import { BoxShadowProps } from '../BoxShadow'

interface CellProps extends ViewProps {
  /** 左侧标题 */
  title?: string | ReactElement
  /** 左侧子标题 */
  subTitle?: string | ReactElement
  /** 右侧描述文字 */
  desc?: string | ReactElement
  /** 自定义左侧图标 */
  renderIcon?: ReactElement
  /** 是否展示右侧箭头，并可设置跳转链接 */
  // isLink?: boolean | string
  /** 圆角数值 */
  radius?: number
}

interface CellGroupProps extends BoxShadowProps {
  /** 是否显示分割线 */
  line?: boolean
  /** 是否使用圆角 */
  radius?: string
}

export const Cell: React.FC<CellProps> & {
  /** 单元格分组 */
  Group: React.FC<CellGroupProps>
}
