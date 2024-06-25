import { ReactNode, CSSProperties, RefForwardingComponent } from 'react'

interface DropDownProps {
  /**
   * 子元素，显示点击区域，必传
   */
  children: ReactNode
  /**
   * 自定义渲染下拉菜单
   */
  renderContent?: ReactNode
  /**
   * 下拉菜单列表，传入则渲染默认下拉菜单
   */
  menuList?: Array<{
    /**
     * 每项的唯一标识，用于计算选中项，必传
     */
    [key: string]: any
    /**
     * 该项显示的文本，必传
     */
    text: string
    /**
     * 该项显示的图标
     */
    icon?: string
    /**
     * 该项是否为分隔线，默认为 false
     */
    line?: boolean
  }>
  /**
   * 下拉菜单项点击事件，参数为 {item, index}
   */
  onSelect?: (param: { item: { [key: string]: any }, index: number }) => void
  /**
   * 当前选中项的索引
   */
  select?: number
  /**
   * 传递给组件内部的 class，用于样式控制
   */
  className?: string
  /**
   * 传递给组件内部的 style，用于样式控制
   */
  style?: CSSProperties
}

/**
 * 下拉菜单组件
 */
export declare const DropDown: RefForwardingComponent<{
  close: () => void
}, DropDownProps>
