import { ReactNode } from 'react'
import { DatePickerProps } from '../Picker/Date'
import { ModalFormProps } from './Modal'

interface PickerValueProps {
  /**
   * 占位符文本
   */
  placeholder: string
  /**
   * 当前值
   */
  value: string
}

declare const PickerValue: React.FC<PickerValueProps>

interface PickerSelectProps {
  /**
   * 弹出选择器的标题
   */
  title: string
  /**
   * 当前选中的值
   */
  value: string
  /**
   * 默认值
   */
  defaultValue?: string
  /**
   * 选项范围
   */
  range: any[]
  /**
   * 占位符文本
   */
  placeholder?: string
  /**
   * 选项对象中表示名称的键名
   */
  nameKey?: string
  /**
   * 选项对象中表示值的键名
   */
  valueKey?: string
  /**
   * 值变化回调函数
   */
  onChange?: (value: string) => void
  /**
   * 启用搜索
   */
  search?: boolean
  /**
   * 子元素
   */
  children?: ReactNode
  /**
   * 传递给modalForm的属性
   */
  modalFormProps?: ModalFormProps
}

declare const PickerSelect: React.FC<PickerSelectProps>

interface PickerMultiSelectProps {
  /**
   * 弹出选择器的标题
   */
  title: string
  /**
   * 当前选中的值数组
   */
  value: any[]
  /**
   * 默认值
   */
  defaultValue?: any[]
  /**
   * 选项范围数组
   */
  range: any[][]
  /**
   * 选项对象中表示名称的键名
   */
  nameKey?: string
  /**
   * 选项对象中表示值的键名
   */
  valueKey?: string
  /**
   * 占位符文本
   */
  placeholder?: string
  /**
   * 值变化回调函数
   */
  onChange?: (value: any[]) => void
  /**
   * 传递给modalForm的属性
   */
  modalFormProps?: ModalFormProps
}

declare const PickerMultiSelect: React.FC<PickerMultiSelectProps>

interface PickerDateProps extends DatePickerProps {
  /**
   * 弹出选择器的标题
   */
  title: string
  /**
   * 当前选中的日期值
   */
  value: string
  /**
   * 默认值
   */
  defaultValue?: string
  /**
   * 值变化回调函数
   */
  onChange?: (value: string) => void
  /**
   * 占位符文本
   */
  placeholder?: string
  /**
   * 传递给modalForm的属性
   */
  modalFormProps?: ModalFormProps
}

declare const PickerDate: React.FC<PickerDateProps>

export {
  PickerSelect,
  PickerMultiSelect,
  PickerDate,
}
