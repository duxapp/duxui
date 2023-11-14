import { ComponentType, Component, CSSProperties } from 'react'

interface CalendarProps {
  /** 日历功能类型 默认为日期选择 */
  mode?: keyof {
    /** 日期选择 */
    day
    /** 周选择 */
    week
    /** 日期范围选择 */
    scope
  }
  /**
   * 选中的值
   * 当为日期选择时需要传入字符串 格式为 2020-01-01
   * 当为周或者范围选择时需要传入数组，数字第一项为开始日期，第二项为结束日期 如 ['2020-01-01', '2020-01-05']
   */
  value?: string | string[]
  /** 样式 */
  style?: CSSProperties
  /** 样式类名 */
  className?: string
  /** 当选择发生改变是触发的时事件 */
  onChange?: (value: string | string[]) => void
  /** 允许选择的最大日期 如2020-01-01 */
  max?: string
  /** 允许选择的最小日期 如2020-01-01 */
  min?: string
  /** 是否仅显示当前日期所在的周 为true只会显示一周的数据 */
  onlyCurrentWeek?: boolean
  /** 引用 */
  ref?: string | ((node: any) => any)
}

interface SelectTast extends Promise<SelectTast> {

}

interface CalendarSelectProps {
  ref?: string | ((node: {
    select: (option: CalendarProps) => SelectTast
  }) => void)
}

/**
 * 日历选择组件
 * @example
 * <Calendar
 *  mode='day'
 *  value='2020-01-01',
 *  onChange={val => console.log(val)}
 * />
 */
export class Calendar extends Component<CalendarProps> {
  /**
   * 计算这个日期是哪一年第几月的第几周
   * 返回一个数组 三项分别是年月周
   */
  static getMonthWeekForDay: (
    /** 日期 如 2020-01-01 */
    day: string
  ) => string[]

  /**
   * 计算指定日期所在的周的第一天和最后一天
   * 返回一个数组 两项 分别是开始和结束日期的字符串
   */
  static getWeekScopeForDay: (
    /** 日期 如 2020-01-01 */
    day: string
  ) => string[]

  /**
   * 计算指定日期所在的月的第一天和最后一天
   * 返回一个数组 两项 分别是开始和结束日期的字符串
   */
  static getMouthScopeForDay: (
    /** 日期 如 2020-01-01 */
    day: string
  ) => string[]
}
