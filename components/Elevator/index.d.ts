import { ViewProps } from '@tarojs/components'
import { ReactElement } from 'react'

interface ElevatorProps extends ViewProps {
  /**
   * 列表数据
   */
  list: { name: string, children: { name: string }[] }[]
  /**
   * 项目点击回调
   */
  onItemClick?: (item: { name: string }) => void
  /**
   * 是否显示右侧导航 默认true
   */
  showNav?: boolean
  /**
   * 自定义数据或者搜索结果为空是要展示的内容
   */
  renderEmpty?: ReactElement
  /**
   * 在滚动区域之外，头部要渲染的内容，通常这个地方用来放 `Elevator.Search`
   */
  renderTop?: ReactElement
  /**
   * 在滚动区域之内的头部要放的内容，不要动态更新这部分的内容，否则会导致导航错误
   */
  renderHeader?: ReactElement
  /**
   * 在滚动区域之内的底部要放的内容
   */
  renderFooter?: ReactElement
}

interface DividerSearchProps {
  /**
   * 输入框中的提示文本
   */
  placeholder?: string
}

export const Elevator: React.FC<ElevatorProps> & {
  Search: React.FC<DividerSearchProps>
}
