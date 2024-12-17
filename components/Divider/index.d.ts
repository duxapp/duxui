import { ViewProps } from '@tarojs/components'

interface DividerProps extends ViewProps {
  /**
   * 是否垂直布局
   */
  vertical?: boolean
  /**
   * 线的粗细
   * @default 1
   */
  size?: number
  /**
   * 线的样式，支持'dotted','dashed','solid'三种
   * @default 'solid'
   */
  type?: 'dotted' | 'dashed' | 'solid'
  /**
   * 自身对齐方式
   * 竖向时默认为 stretch
   */
  self?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /**
   * 颜色类型
   */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom1' | 'custom2' | 'custom3'
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
  type?: 'dotted' | 'dashed' | 'solid'
  /**
   * 是否垂直布局
   */
  vertical?: boolean
  /**
   * 自身对齐方式
   * 竖向时默认为 stretch
   */
  self?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /**
   * 颜色类型
   */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom1' | 'custom2' | 'custom3'
}

export const Divider: React.FC<DividerProps> & {
  Group: React.FC<DividerGruopProps>
}
