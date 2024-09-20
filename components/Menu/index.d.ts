import { ReactElement, FC, Ref } from 'react'
import { RowProps } from '../Flex'
import { LayoutProps } from '../../../duxapp/components/Layout'

type MenuItemOptions = {
  value: any
  name: string
}

type MenuItemClickOptions = {
  options: MenuItemOptions[]
  column: number
  align?: 'left' | 'center' | 'right'
  value: any
  index: number
  children: ReactNode
}

interface MenuItemProps extends RowProps {
  /**
   * 菜单项标题
   */
  title: string
  /**
   * 菜单项的选项列表
   */
  options?: MenuItemOptions[]
  /**
   * 单选是否能取消选中项目
   */
  cancel?: boolean
  /**
   * 是否多选 暂未开发此功能
   */
  checkbox?: boolean
  /**
   * 列数
   */
  column?: number
  /**
   * 文本对齐方式
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 当前选中的值
   */
  value: any
  /**
   * 自定义图标区域
   */
  renderIcon?: ReactElement
  /**
   * 值改变时的回调函数
   */
  onChange?: (value: any) => void
  /**
   * 自定义渲染弹出元素，优先级高于options
   */
  children?: ReactElement
  /**
   * 点击事件回调函数，当传入点击事件参数时，默认的点击事件将不会被触发
   */
  onClick?: () => void
}

interface MenuProps extends LayoutProps {
  /**
   * 弹出的菜单是否显示圆角
   */
  round?: boolean
}

interface MenuItemClickHandler {
  /**
   * 切换菜单项的显示/隐藏状态
   */
  toggle: () => void
}

export const Menu: FC<MenuProps> & {
  Item: FC<MenuItemProps & { ref?: Ref<MenuItemClickHandler> }>
}
