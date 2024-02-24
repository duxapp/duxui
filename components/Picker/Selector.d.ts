import { ReactNode } from 'react'

interface SelectorPickerProps {
  /**
   * 选择器的选项范围，一个数组。
   * 可以是字符串或包含`name`和`value`属性的对象。
   */
  range: any[]

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
  value?: any

  /**
   * 值改变时触发事件
   */
  onChange?: (value: any) => void
}

export const SelectorPicker: FC<SelectorPickerProps>
