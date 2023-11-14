declare namespace date {
  /** 时间间隔 */
  interface DateInterval {
    /** 年 */
    y
    /** 月 */
    m
    /** 日 */
    d
    /** 星期 */
    w
    /** 小时 */
    h
    /** 分钟 */
    n
    /** 秒 */
    s
  }
}

/**
 * 日期对象转换为指定格式的字符串
 * @param formatStr 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
 * @param date Date日期对象或者时间戳或者带毫秒的时间戳, 如果缺省，则为当前时间
 * YYYY/yyyy/YY/yy 表示年份
 * MM/M 月份
 * W/w 星期
 * dd/DD/d/D 日期
 * hh/HH/h/H 时间
 * mm/m 分钟
 * ss/SS/s/S 秒
 * @return string 指定格式的时间字符串
 */
export function dateToStr(formatStr: string, date: Date | string | number): string

/**
 * 日期计算
 * @param strInterval 可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
 * @param num 对应数值
 * @param date 日期对象 默认当前时间
 * @return 返回计算后的日期对象
 */
export function dateAdd(strInterval: keyof date.DateInterval, num: number, date: Date): Date

/**
 * 把指定格式的字符串转换为日期对象
 * @param formatStr 待转换的时间的时间格式 yyyy-MM-dd HH:mm:ss
 * @param dateStr 待转换的时间字符串
 * @return 转换后的日期对象
 */
export function strFormatToDate(formatStr: string, dateStr: string): Date

/**
 * 返回月份的最大天数
 * @param year 年
 * @param month 月
 * @return 当前月的最大天数
 */
export function getMaxDay(year: number, month: number): number

