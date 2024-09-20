import { ReactNode } from 'react'

type Mode = 'datetime' | 'date' | 'time' | 'month' | 'year'

interface Locale {
  // 年份显示文本
  year: string
  // 月份显示文本
  month: string
  // 天数显示文本
  day: string
  // 小时显示文本
  hour: string
  // 分钟显示文本
  minute: string
}

interface DatePickerProps {
  // 默认日期
  defaultValue?: string
  // 当前日期
  value?: string
  // 日期选择的模式
  mode?: Mode
  // 最小时间
  minDate?: string
  // 最大时间
  maxDate?: string
  // 是否禁用
  disabled?: boolean
  // 日期改变的回调函数
  onChange?: (date: Date, dateString: string) => void
  // 自定义面板的样式
  style?: React.CSSProperties
  // 自定义面板的类名
  className?: string
  // 是否使用12小时制
  use12Hours?: boolean
  // 本地化配置
  locale?: Locale
}

export const DatePicker: React.FC<DatePickerProps>
