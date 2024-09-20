import { LegacyRef, FC } from 'react'

interface ModalProps {
  /**
   * 控制Modal是否显示
   */
  show: boolean
  /**
   * 分组 同一个分组的弹框将会以队列的形式显示
   */
  group?: string
  /**
   * 是否开启动画 默认开启
   */
  animation?: boolean
  /**
   * 关闭事件
   * @returns
   */
  onClose?: () => void
  /**
   * 阴影不透明度
   */
  overlayOpacity?: number
  /**
   * 是否可以点击阴影关闭modal 默认true
   */
  maskClosable?: boolean
  /** 引用 */
  ref?: LegacyRef<any>
}

/**
 * 全局Modal弹窗
 * 此组件需要配合TopView组件使用
 * @example
 * ```jsx
 * <Modal show>
 *   <Text>此处的内容将会以动画的方式展示在页面中央</Text>
 * </Modal>
 * ```
 */
export const Modal: FC<ModalProps>
