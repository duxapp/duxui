import { ReactElement } from 'react'

export const confirm: (option: {
  /**
   * 标题 默认 “提示”
   * 可以传入空字符串禁用标题
   */
  title?: string
  /**
   * 内容
   */
  content?: string | ReactElement
  /**
   * 是否显示取消按钮
   * 默认true
   */
  cancel?: boolean
  /**
   * 取消按钮的文本
   */
  cancelText?: string
  /**
   * 确定按钮的文本
   */
  confirmText?: string
  /**
   * 要显示在弹框上方的内容
   */
  renderTop?: ReactElement
  /**
   * 要显示在弹框下方的内容
   */
  renderBottom?: ReactElement
}) => Promise<boolean> & {
  /**
   * 主动触发点击确定事件
   */
  confirm: () => void
  /**
   * 主动触发点击取消事件
   */
  cancel: () => void
  /**
   * 主动触发关闭提示框
   * 返回的Promise将抛出错误
   */
  close: () => void
}
/**
 * 显示一个顶部弹出的消息
 * 返回的函数用于关闭消息
 */
export const message: (
  /**
   * 消息标题
   */
  title: string,
  /**
   * 消息内容
   */
  content?: string,
  /**
   * 点击消息跳转地址
   */
  url?: string
) => (() => void)
