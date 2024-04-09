import { ReactElement, ReactNode, ChangeEvent, ComponentType } from 'react'

/** 弹出位置 */
interface side {
  /** 底部弹出 */
  bottom
  /** 顶部弹出 */
  top
  /** 左侧弹出 */
  left
  /** 右侧弹出 */
  right
}

/**
 * 重置模式
 */
interface resetMode {
  /** 重置到Form设置的默认值 此属性是默认值 */
  default
  /** 清除value 设置为undefined */
  clear
  /** 重置到上一次的value */
  prev
}

interface ModalFormProps {
  /**
   * 当前值
   */
  value: any

  /**
   * 值变化时的回调函数
   */
  onChange: (value: any) => void

  /**
   * 获取value的显示值
   * @param value
   * @returns
   */
  getValue: (value: any) => string

  /**
   * 弹出位置
   */
  side?: keyof side,

  /**
   * 子元素
   */
  children: ReactElement

  /**
   * 设置子元素接收显示值的props属性名称，将会改写子元素的此属性
   */
  childPropsValueKey: string

  /**
   * 渲染表单的组件或组件类型
   */
  renderForm: ReactElement | ComponentType<any>

  /**
   * 标题
   */
  title?: string

  /**
   * 占位文本
   */
  placeholder?: string

  /**
   * 是否显示按钮
   */
  showButton?: boolean

  /**
   * 是否在值发生改变时自动提交
   */
  autoSubmit?: boolean

  /**
   * 重置按钮重置的方式
   */
  resetMode?: keyof resetMode
}

interface ResetProps {
  /**
   * 子元素
   */
  children: ReactNode

  /**
   * 重置按钮重置的方式
   */
  resetMode?: keyof resetMode
}

interface SubmitProps {
  /**
   * 子元素
   */
  children: ReactNode
  /**
   * 设置提交的值，如果设置了提交的时候将按照此值提交
   * 设置为unedfined无效
   */
  value?: any
}

/**
 * ModalForm组件的类型定义
 */
export const ModalForm: React.FC<ModalFormProps> & {
  /**
   * Reset组件类型定义
   */
  Reset: React.FC<ResetProps>

  /**
   * Submit组件类型定义
   */
  Submit: React.FC<SubmitProps>
}

interface ModalFormsProps {

  /**
   * 弹出位置
   */
  side?: keyof side,

  /**
   * 子元素
   */
  children: ReactElement

  /**
   * 渲染表单的组件或组件类型
   */
  renderForm: ReactElement | ComponentType<any>

  /**
   * 标题
   */
  title?: string

  /**
   * 是否自动提交（不需要点击提交按钮自动提交数据）
   */
  autoSubmit?: boolean

  /**
   * 是否显示按钮
   */
  showButton?: boolean

  /**
   * 重置按钮重置的方式
   */
  resetMode?: keyof resetMode
}

/**
 * ModalForm组件的类型定义
 */
export const ModalForms: React.FC<ModalFormsProps> & {
  /**
   * Reset组件类型定义
   */
  Reset: React.FC<ResetProps>

  /**
   * Submit组件类型定义
   */
  Submit: React.FC<SubmitProps>
}
