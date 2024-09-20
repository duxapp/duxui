import { CSSProperties } from 'react'

interface SignProps {
  // 指定笔画的颜色
  color?: string
  // 触发上传操作后的Change事件
  onChange?: (val: string) => void
  // 组件样式
  className?: string
  // 组件样式
  style?: CSSProperties
}

export const Sign: React.FC<SignProps & {
  // 清空画布
  clear: () => void
  // 保存数据
  save: () => Promise<string>
}>
