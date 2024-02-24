import { ReactNode, FC } from 'react'

interface MultiSelectorPickerProps {
  /**
   * 选择器的选项范围，一个二维数组。
   * 每个子数组代表一个选择器列，可以是字符串或包含`name`和`value`属性的对象。
   */
  range: Array<Array<string | Record<string, string>>>

  /**
   * 对象类型选项的属性名称，用于显示在选择器中的文本。
   * 默认值为 `'name'`。
   */
  nameKey?: string

  /**
   * 对象类型选项的属性名称，用于表示选择的值。
   * 默认值为 `'value'`。
   */
  valueKey?: string

  /**
   * 值
   */
  value?: any[]

  /**
   * 值改变时触发事件
   */
  onChange?: (value: any[]) => void
}

export const MultiSelectorPicker: FC<MultiSelectorPickerProps>
