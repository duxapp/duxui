import { ReactNode, CSSProperties } from 'react'

interface CascadeData {
  value: string | number
  name: string
  children?: CascadeData[]
}

type CascadeMode = 'radio' | 'checkbox'

type CascadeTheme = 'default' | 'fill'

interface CascadeProps {
  /**
   * 数据源，包含级联数据的数组
   */
  data: CascadeData[]
  /**
   * 异步加载子分类数据的回调函数
   */
  getData?: (current: CascadeData, level: number) => Promise<CascadeData[]>
  /**
   * 当前选中的值
   */
  value?: string | number | (string | number)[]
  /**
   * 值改变时的回调函数
   */
  onChange?: (value: string | number | (string | number)[]) => void
  /**
   * 值改变时的回调函数，返回选中的项或多项数据
   */
  onChangeItem?: (item: CascadeData | CascadeData[]) => void
  /**
   * 选择模式，单选或多选
   * @default 'radio'
   */
  mode?: CascadeMode
  /**
   * 是否允许选择任何一级分类
   * @default false
   */
  anyLevel?: boolean
  /**
   * 组件主题样式
   * @default 'default'
   */
  theme?: CascadeTheme
  /**
   * 显示的层级数量
   * @default 1
   */
  level?: number
  /**
   * 子分类数据的键名
   * @default 'children'
   */
  childrenKey?: string
  /**
   * 分类名称的键名
   * @default 'name'
   */
  nameKey?: string
  /**
   * 值的键名
   * @default 'value'
   */
  valueKey?: string
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 自定义样式
   */
  style?: CSSProperties
}

/**
 * 级联选择组件
 */
export const Cascade: React.FC<CascadeProps>
