import { LegacyRef, ComponentType, CSSProperties } from 'react'

/** 弹出位置 */
interface side {
  /** 底部弹出 */
  bottom
  /** 顶部弹出 */
  top
  /** 左侧弹出 */
  left
  /** 右侧弹出 */
  right
}

interface PullViewProps {
  /**
   * 弹出位置
   * @default buttom
  */
  side: keyof side,
  /**
   * 空白区域的不透明度
   * @default 0.5
  */
  overlayOpacity: number
  /**
   * 是否锁定模态框 设置为true点击空白区域无法关闭模态框
   * @default false
  */
  modal: boolean
  /** 弹出层内层样式 */
  style: CSSProperties
  /** 点击非内容区域的关闭事件 */
  onClose: () => any
  /** 引用 */
  ref?: LegacyRef<any>
}

/**
 * 从四个方向弹出模态框
 * 此组件需要配合TopView组件使用
 * 当side为top或者buttom时，请确保你的内容具有固定的高度 为left或者right是确保你的内容具有固定宽度（使用flex: 1或者height: 100%让你的内容获取全部高度）
 * @example
 * ```jsx
 * {show && <PullView onClose={() => this.setState({ show: false })}>
 *  <Text>将子内容放在这里，这里可以放任何内容作为弹出内容</Text>
 * </PullView>}
 * ```
 */
export const PullView: ComponentType<PullViewProps>
