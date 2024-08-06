import { ComponentType, Component, CSSProperties } from 'react'

interface CunstomCallbackConfig {
  /** 当前日期的字符串格式 如：2024-01-01 */
  date: string
  /** 当前日文本数字 */
  text: number,
  /** 是否选中 */
  select: boolean
  /** 选中的类型 */
  selectType: keyof {
    /** 范围开始 */
    start,
    /** 范围结束 */
    end,
    /** 范围中间部分 */
    center,
    /** 选中单个日期 */
    select
  }
  /** 当前日期是否禁用 */
  disable: boolean
  /** 自定义日期数据的类型 */
  customType: keyof {
    /** 范围开始 */
    start,
    /** 范围结束 */
    end,
    /** 范围中间部分 */
    center,
    /** 选中单个日期 */
    select
  }
}

interface CalendarSelect {
  /** 日期背景样式 { backgroundColor: '#fee1d3' } */
  style?: CSSProperties | ((config: CunstomCallbackConfig) => CSSProperties)
  /** 日期文字样式 */
  textStyle?: CSSProperties | ((config: CunstomCallbackConfig) => CSSProperties)
  /** 日期文本 */
  text?: string | ReactElement | ((config: CunstomCallbackConfig) => string | ReactElement)
  /** 自定义日期上侧显示 */
  top?: string | ReactElement | ((config: CunstomCallbackConfig) => string | ReactElement)
  /** 自定义日期上下侧显示 */
  bottom?: string | ReactElement | ((config: CunstomCallbackConfig) => string | ReactElement)
}

interface CalendarCustom extends CalendarSelect {
  /** 日期或者日期范围组成的数组 */
  date: (string | [string, string])[]
}

interface CalendarProps {
  /** 日历功能类型 默认不支持选择 */
  mode?: keyof {
    /** 日期选择 */
    day
    /** 周选择 */
    week
    /** 日期范围选择 */
    scope
  }
  /**
   * 多选模式
   */
  checkbox?: boolean
  /**
   * 选中的值
   * 当为日期选择时需要传入字符串 格式为 2020-01-01
   * 当为周或者范围选择时需要传入数组，数字第一项为开始日期，第二项为结束日期 如 ['2020-01-01', '2020-01-05']
   * 多选模式时，将会在以上基础上再套一层数组
   */
  value?: string | string[] | string[][]
  /** 样式 */
  style?: CSSProperties
  /** 样式类名 */
  className?: string
  /** 导航部分的样式 */
  navStyle?: CSSProperties
  /** 头部的容器样式 */
  headStyle?: CSSProperties
  /** 当选择发生改变是触发的时事件 */
  onChange?: (value: string | string[]) => void
  /** 月份切换的时候触发 */
  onMonthChange?: (value: string) => void
  /** 日期天点击事件 如果返回true将会阻止默认操作 如选中日期 */
  onDayClick?: (option: {
    day: string
    /** 范围选择的开始日期 不存在就是第一次选择 */
    scopeStart: string
  }) => boolean
  /** 允许选择的最大日期 如2020-01-01 */
  max?: string
  /** 允许选择的最小日期 如2020-01-01 */
  min?: string
  /** 是否仅显示当前日期所在的周 为true只会显示一周的数据 */
  onlyCurrentWeek?: boolean
  /** 禁用的日期 日期或者日期范围组成的数组 */
  disabledDate?: (string | [string, string])[]
  /** 可用的日期 除了传入的日期或者范围，其他的日期将被禁用，当 enabledDate 的日期在 disabledDate 里面时 此日期将不可用 */
  enabledDate?: (string | [string, string])[]
  /** 自定义日期日历数据 */
  customDate?: CalendarCustom[]
  /** 自定义选中的部分的日历数据 */
  customSelect?: CalendarSelect
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
