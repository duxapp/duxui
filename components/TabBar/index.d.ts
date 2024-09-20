import { ViewProps } from '@tarojs/components'
import { ReactElement, Component } from 'react'

interface TabBarProps extends ViewProps {
  /** 切换时的回调 */
  onChange: (select: number) => void
}

interface TabBarItemProps {
  /** 切换时的回调 */
  component: Component
  /** TabBar的组件，需要传入一个未实例化的组件，用来作为当前导航的页面内容 */
  name: string
  /** 当前项的名称，可以传入为空，用icon属性自定义显示内容 */
  icon: Component
}

interface TabBarItemIconProps {
  /** 当前项目是否选中 */
  hover: boolean
  /** 当前项目的名称，可以不传入，让只显示图标 */
  name: string
  /** 未选中时候的图片 */
  image: string
  /** 选中时候的图片 */
  imageHover: string
  /** 自定义图片的显示 */
  icon?: ReactElement
}

const TabBar: React.FC<TabBarProps> & {
  Item: React.FC<TabBarItemProps>
  ItemIcon: React.FC<TabBarItemIconProps>
  /** 切换到index页面 */
  switch: (index: number) => void
  /**
   * 设置某某个项目的红点数
   * 当设置的值大于0将显示设置的数值，
   * 当设置的数字小于0，将显示一个红点
   * 当设置的数字等于0将不显示
   */
  setNumber: (index: number, number: number) => void
  /** 监听切换，返回一个Promise，如果排除错误，将会停止跳转 */
  onSwitchBefore: (callback: ({ index: number }) => Promise<{}>) => void
  /** 监听切换成功 */
  onSwitchAfter: (callback: ({ index: number }) => Promise<{}>) => void
  /**
   * 展示出来的hook，这个hook需要在每个项目组件中使用，用来判断当前组件是是否展示出来
   * 切换到该页面或者从下一个页面返回时，当前页面是激活状态就会触发
   */
  useShow: (callback: () => void) => void
  /**
   * 隐藏的hook，这个hook需要在每个项目组件中使用，用来判断当前组件是否被隐藏
   * 从当前项目切换到其他项目，或者当前项目激活时，跳转到其他页面就会触发
   */
  useHide: (callback: () => void) => void
  /**
   * 返回一个当前页面显示还是隐藏的状态值，这个值可以用在其他hook中进行使用
   */
  useShowStatus: () => boolean
}

export const createTabBar = () => TabBar
