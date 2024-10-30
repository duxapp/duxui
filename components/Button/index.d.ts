import { CSSProperties, ComponentType, ReactElement } from 'react'
import { ViewProps, ButtonProps as TaroButtonProps } from '@tarojs/components'

/** 圆角类型 */
interface type {
  /** 默认样式 */
  default
  /** 主色 */
  primary
  /** 辅色 */
  secondary
  /** 成功 */
  success
  /** 错误 */
  danger
  /** 警告 */
  warning
  /** 自定义1 */
  custom1
  /** 自定义2 */
  custom2
  /** 自定义3 */
  custom3
}

/** 圆角类型 */
interface radiusType {
  /** 直角 */
  square
  /** 圆角 */
  round
  /** 较小的圆角 */
  'round-min'
}

/** 尺寸 */
interface size {
  /** s号 */
  s
  /** m号 */
  m
  /** l号 */
  l
}


interface ButtonProps extends ViewProps {
  /** 按钮类型 */
  type?: keyof type
  /** 按钮颜色 设置多个颜色可以渐变 此属性优先级低于type */
  color?: string | string[]
  /**
   * 渐变角度，仅颜色为数组时生效
   * @default 90 从左到右
   */
  colorAngle?: number
  /** 圆角类型 */
  radiusType?: keyof radiusType
  /** 按钮尺寸 */
  size?: keyof size
  /** 镂空效果 当为渐变是此属性不会生效 */
  plain?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 显示loading */
  loading?: boolean
  /** 按钮文字样式 */
  textStyle?: CSSProperties
  /** 自定义渲染按钮内容 当你的内容是图片或者图标以外的内容时，使用此属性替换 */
  renderContent?: ReactElement
  /** 点击事件 */
  onClick?: () => any
  /** 按钮内容 支持文本或者图标 */
  children?: string
  /** 小程序端 openType 属性 */
  openType?: keyof TaroButtonProps.OpenType
}

/**
 * 统一样式的按钮
 * @example
 * ```jsx
 * <Button text='立即购买' size='l' plain />
 * ```
 */
export const Button: ComponentType<ButtonProps>
