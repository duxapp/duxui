import type { FC } from 'react'

export interface KatexProps {
  /**
   * LaTeX 字符串
   * @default ''
   */
  math?: string
  /**
   * 是否内联
   * @default true
   */
  inline?: boolean
  /**
   * 颜色
   * @default 'textColor1'
   */
  color?: string
  /**
   * 配置对象：
   * - RN：MathJax SVG 配置
   * - 小程序/H5：KaTeX 渲染选项
   */
  config?: any

  /**
   * 各端样式类型不同，这里放宽
   */
  style?: any
}

export const Katex: FC<KatexProps>
