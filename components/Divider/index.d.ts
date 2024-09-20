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
}

export const Divider: React.FC<DividerProps> & {
  Group: React.FC<DividerGruopProps>
}
