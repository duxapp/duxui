import { ViewProps, SwiperProps } from '@tarojs/components'
import { ReactNode, CSSProperties } from 'react'
import { BadgeProps } from '../Badge'

interface TabProps extends ViewProps {
  /** tab主题样式 */
  type?: 'line' | 'button'
  /** 按钮形式的时候未选中按钮背景颜色 可以指定为page颜色 默认为白色 */
  buttonColor?: 'page'
  /** 按钮是否具有圆角 */
  buttonRound?: boolean
  /** 当前选中的标签页的 key */
  value?: string | number
  /** 默认选中的标签页的 key */
  defaultValue?: string | number
  /** 切换标签页时的回调函数 */
  onChange?: () => void
  /**
   * 开启滑动切换选项卡功能
   * 开启这个选项你得给 Tab 组件设置高度或者使用其他方法让 Tab 具有高度，否则内容不会显示
  */
  swiper?: boolean
  /** 开启 swiper 后传递给 Swiper 组件的属性 */
  swiperProps?: SwiperProps
  /** 是否禁用 */
  disabled?: boolean
  /** 高度撑满容器(flex: 1) 默认不撑起 */
  justify?: boolean
  /** 设置为`true`时，将不会在组件挂载的时候渲染被隐藏的标签页。 */
  lazyload?: boolean
  /** 是否可横向滚动 */
  scroll?: boolean
  /** 在右侧显示展开更多按钮 仅在滚动模式下生效 */
  expand?: boolean
  /** 仅有一个Tab时是否隐藏Tab显示 */
  oneHidden?: boolean
  /** tab的样式 */
  tabStyle?: CSSProperties
  /** 自定义样式函数 */
  getItemStyle?: (option: {
    /** 是否选中 */
    select: boolean
  }) => {
    line?: CSSProperties
    text?: CSSProperties
    container?: CSSProperties
  }
}

interface TabItemProps {
  /** 标签标题 */
  title?: string
  /** 对应的标签页的 key */
  paneKey?: string | number
  /** 显示红点组件的属性 */
  badgeProps?: BadgeProps
}

export const Tab: React.FC<TabProps>

export const TabItem: React.FC<TabItemProps>
