import { ReactNode, Component } from 'react'
import { LayoutProps } from '..'

interface HorseLanternLotteryProps extends LayoutProps {
  /** 行 默认3 请勿设置小于3的数字 */
  row?: number
  /** 列 默认3 请勿设置小于3的数字 */
  column?: number
  /** 奖品列表 奖品列表的长度要大于等于实际展示的奖品数量 */
  list: any[]
  /** 是否禁用开始抽奖 */
  disabled?: boolean
  /** 渲染奖品项目的组件 */
  renderItem: Component
  /** 开始按钮的渲染节点 */
  renderStart: ReactNode
  /** 项目间距 */
  gap?: number
  /** 开始回调 可以使用同步或者异步返回需要选中的index 返回的不是数字则随机选中结果 */
  onStart?: () => void | number | Primise<number>
  /** 结果回调 */
  onEnd?: (e: { index: number }) => void
  /** 禁用的时候点击开始区域的回调 */
  onDisabledClick?: () => void
}

export const HorseLanternLottery: React.FC<HorseLanternLotteryProps>
