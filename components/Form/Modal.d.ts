import { ReactElement, ReactNode } from 'react'
import { ButtonProps } from '../Button'

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
  value?: any

  /**
   * 值变化时的回调函数
   */
  onChange?: (value: any) => void

  /**
   * 默认值
   */
  defaultValue?: any

  /**
   * 获取value的显示值
   * @param value
   * @returns
   */
  getValue?: (value: any) => string

  /**
   * 在用户点击提交之前执行的函数，这可以是一个异步函数
   * 如果要阻止用户提交 需要抛出一个错误
   */
  onSubmitBefore?: (value: any) => Promise<{}>

  /**
   * 弹出位置
   */
  side?: keyof side,

  /**
   * 子元素
   */
  children?: ReactElement

  /**
   * 设置子元素接收显示值的props属性名称，将会改写子元素的此属性
   */
  childPropsValueKey?: string

  /**
   * 渲染表单的组件
   */
  renderForm: ReactElement

  /**
   * 标题
   */
  title?: string

  /**
   * 内容显示在renderForm的上边
   */
  renderHeader?: ReactElement

  /**
   * 内容显示在renderForm的下边
   */
  renderFooter?: ReactElement

  /**
   * 占位文本 默认请选择
   */
  placeholder?: string

  /**
   * 是否显示按钮
   */
  showButton?: boolean

  /**
   * 是否在值发生改变时自动提交，也就是不需要点击提交就将值赋值到表单中
   */
  autoSubmit?: boolean

  /**
   * 重置按钮重置的方式
   */
  resetMode?: keyof resetMode
}

interface ResetProps extends ButtonProps {
  /**
   * 子元素
   */
  children: ReactNode

  /**
   * 重置按钮重置的方式
   */
  resetMode?: keyof resetMode
}

interface SubmitProps extends ButtonProps {
  /**
   * 子元素
   */
  children: ReactNode
  /**
   * 设置提交的值，如果设置了提交的时候将按照此值提交
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
   * 子元素，需要是一个可点击的单个元素
   */
  children: ReactElement

  /**
   * 渲染表单的组件
   */
  renderForm: ReactElement

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

  /**
   * 在用户点击提交之前执行的函数，这可以是一个异步函数
   * 如果要阻止用户提交 需要抛出一个错误
   * autoSubmit 为 false 的情况下生效
   */
  onSubmitBefore?: (value: {[key: string]: any}) => Promise<{}>
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
