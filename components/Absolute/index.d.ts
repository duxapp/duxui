import { LegacyRef, ComponentType } from 'react'

interface AbsoluteProps {
  /** 子元素 */
  children: ReactNode
}

/**
 * 将内容添加到顶层
 * 此组件需要配合TopView组件使用
 * @example
 * ```jsx
 * <Asbolute>
 *   <Text>此处的内容将会添加在和TopView组件相同的位置上</Text>
 * </Asbolute>
 * ```
 */
export const Absolute: ComponentType<AbsoluteProps>
