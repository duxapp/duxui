import { View, ViewProps } from '@tarojs/components'

interface DividerProps {
  /**
   * 分割线的方向
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical',
  /**
   * 线的粗细
   * @default 1
   */
  size?: number,
  /**
   * 线的样式，支持'dotted','dashed','solid'三种
   * @default 'solid'
   */
  type?: 'dotted' | 'dashed' | 'solid',
  /**
   * 两端的内边距
   * @default 0
   */
  padding?: number
}

interface DividerGruopProps {
  /**
   * 线的粗细
   * @default 1
   */
  size?: number,
  /**
   * 线的样式，支持'dotted','dashed','solid'三种
   * @default 'solid'
   */
  type?: 'dotted' | 'dashed' | 'solid',
  /**
   * 两端的内边距
   * @default 0
   */
  padding?: number
}

export const Divider: React.FC<DividerProps> & {
  Group: React.FC<DividerGruopProps>
}