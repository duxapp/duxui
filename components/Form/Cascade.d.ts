import { ReactNode, FC } from 'react'
import { ViewProps } from '@tarojs/components'

interface CascadeData {
  value: string | number
  name: string
  children?: CascadeData[]
}

type CascadeTheme = 'default' | 'fill'

interface CascadeProps extends ViewProps {
  /**
   * 数据源，包含级联数据的数组
   */
  data: CascadeData[]
  /**
   * 当没有一次性返回全部数据时，加载子分类数据的回调函数
   */
  getData?: (current: CascadeData, level: number) => Promise<CascadeData[]>
  /**
   * 当前选中的值
   */
  value?: string | number | (string | number)[]
  /**
   * 默认值
   */
  defaultValue?: string | number | (string | number)[]
  /**
   * 禁用选择
   */
  disabled: boolean
  /**
   * 值改变时的回调函数
   */
  onChange?: (value: string | number | (string | number)[]) => void
  /**
   * 会把选中项的对象，而不是值传回去
   */
  onChangeItem?: (item: CascadeData | CascadeData[]) => void
  /**
   * 是否多选模式
   */
  checkbox?: boolean
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
}

/**
 * 级联选择组件
 */
export const Cascade: FC<CascadeProps>
