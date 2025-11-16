/* eslint-disable no-shadow */
import { useState, useEffect, useMemo, useRef } from 'react'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import { pure } from '@/duxui/utils'
import { PickerView, PickerViewColumn, PickerViewColumnItem } from './PickerView'
import './common.scss'

// 工具函数
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
const pad = (n) => n < 10 ? `0${n}` : `${n}`
const cloneDate = (date) => new Date(+date)

const setMonth = (date, month) => {
  date.setDate(Math.min(date.getDate(), getDaysInMonth(new Date(date.getFullYear(), month))))
  date.setMonth(month)
}

export const DatePicker = /*@__PURE__*/ pure(() => {
  const DatePicker_ = props => {
    const {
      locale = {
        year: '年',
        month: '月',
        day: '日',
        hour: '时',
        minute: '分',
        second: '秒',
        am: '上午',
        pm: '下午',
      },
      mode,
      format = modes[mode] || 'YYYY-MM-DD',
      timestamp,
      disabled = false,
      minuteStep = 1,
      secondStep = 1,
      onChange = () => { },
      use12Hours = false,
      value: propValue,
      defaultValue,
      minDate,
      maxDate,
      style,
      itemStyle,
      className,
      grow,
    } = props

    // 解析格式字符串获取需要的字段
    const formatFields = useMemo(() => {
      const fields = []
      if (format.includes('YYYY')) fields.push('year')
      if (format.includes('MM')) fields.push('month')
      if (format.includes('DD')) fields.push('day')
      if (format.includes('HH')) fields.push('hour')
      if (format.includes('mm')) fields.push('minute')
      if (format.includes('ss')) fields.push('second')
      if (use12Hours) fields.push('ampm')
      return fields
    }, [format, use12Hours])

    // 初始化日期
    const initDate = useMemo(() => {
      const now = dayjs()
      let dateStr = propValue || defaultValue

      // 如果没有值，使用当前时间并根据格式自动补全
      if (!dateStr) {
        const formatMap = {
          YYYY: now.format('YYYY'),
          MM: now.format('MM'),
          DD: now.format('DD'),
          HH: now.format('HH'),
          mm: now.format('mm'),
          ss: now.format('ss'),
        }

        // 根据格式构建默认值
        dateStr = timestamp ? Date.now() : format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, (match) => formatMap[match])
      }
      return parseDateString(dateStr, format)
    }, [propValue, defaultValue, format, timestamp])

    const [date, setDate] = useState(initDate)

    const refs = useRef({}).current

    refs.date = date

    // 默认最小/最大日期
    const defaultMinDate = useMemo(() => new Date(2000, 0, 1, 0, 0, 0), [])
    const defaultMaxDate = useMemo(() => new Date(2030, 0, 1, 23, 59, 59), [])


    // 格式化日期为字符串
    const formatDateToString = (date) => {
      const y = date.getFullYear()
      const M = date.getMonth() + 1
      const d = date.getDate()
      const H = date.getHours()
      const m = date.getMinutes()
      const s = date.getSeconds()

      return format
        .replace('YYYY', pad(y))
        .replace('MM', pad(M))
        .replace('DD', pad(d))
        .replace('HH', pad(H))
        .replace('mm', pad(m))
        .replace('ss', pad(s))
    }

    // 当props.value变化时更新state
    useEffect(() => {
      if (propValue) {
        if (propValue !== (timestamp ? refs.date.getTime() : formatDateToString(refs.date))) {
          setDate(parseDateString(propValue, format))
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propValue, format, refs])

    // 触发onChange
    const emitChange = (newDate) => {
      onChange(timestamp ? newDate.getTime() : formatDateToString(newDate))
    }

    // 初始化时触发一次onChange
    useEffect(() => {
      if (!propValue) {
        emitChange(date)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 获取最小/最大日期
    const getDate = () => date
    const getMinDate = () => minDate ? parseDateString(minDate, format) : defaultMinDate
    const getMaxDate = () => maxDate ? parseDateString(maxDate, format) : defaultMaxDate

    // 限制日期范围
    const clipDate = (date) => {
      const minDate = getMinDate()
      const maxDate = getMaxDate()

      if (date < minDate) return cloneDate(minDate)
      if (date > maxDate) return cloneDate(maxDate)
      return date
    }

    // 处理值变化
    const onValueChange = (values, index) => {
      const newDate = updateDate(values, index)
      setDate(newDate)
      emitChange(newDate)
    }

    // 更新日期对象
    const updateDate = (values, index) => {
      const newDate = cloneDate(date)
      const field = formatFields[index]
      const value = parseInt(values[index], 10)

      switch (field) {
        case 'year':
          newDate.setFullYear(value)
          break
        case 'month':
          setMonth(newDate, value)
          break
        case 'day':
          newDate.setDate(value)
          break
        case 'hour':
          setHours(newDate, value)
          break
        case 'minute':
          newDate.setMinutes(value)
          break
        case 'second':
          newDate.setSeconds(value)
          break
        case 'ampm':
          setAmPm(newDate, value)
          break
        default:
          break
      }

      return clipDate(newDate)
    }

    // 设置小时（处理12小时制）
    const setHours = (date, hour) => {
      if (use12Hours) {
        const currentHours = date.getHours()
        let newHour = hour

        if (currentHours >= 12) {
          newHour = hour + 12
        }

        newHour = newHour >= 24 ? 0 : newHour
        date.setHours(newHour)
      } else {
        date.setHours(hour)
      }
    }

    // 设置上午/下午
    const setAmPm = (date, value) => {
      const hours = date.getHours()
      if (value === 0 && hours >= 12) {
        date.setHours(hours - 12)
      } else if (value === 1 && hours < 12) {
        date.setHours(hours + 12)
      }
    }

    // 获取显示用的小时（12小时制转换）
    const getDisplayHour = (hour) => {
      if (!use12Hours) return hour
      if (hour === 0) return 12
      if (hour > 12) return hour - 12
      return hour
    }

    // 生成选择器列数据
    const getPickerColumns = () => {
      const columns = []
      const currentDate = getDate()
      const minDate = getMinDate()
      const maxDate = getMaxDate()

      formatFields.forEach((field) => {
        switch (field) {
          case 'year': {
            const minYear = minDate.getFullYear()
            const maxYear = maxDate.getFullYear()
            const years = []

            for (let i = minYear; i <= maxYear; i++) {
              years.push({
                value: `${i}`,
                label: `${i}${locale.year}`,
              })
            }

            columns.push({
              key: 'year',
              props: { children: years },
            })
            break
          }

          case 'month': {
            const minMonth = currentDate.getFullYear() === minDate.getFullYear()
              ? minDate.getMonth()
              : 0
            const maxMonth = currentDate.getFullYear() === maxDate.getFullYear()
              ? maxDate.getMonth()
              : 11
            const months = []

            for (let i = minMonth; i <= maxMonth; i++) {
              months.push({
                value: `${i}`,
                label: `${i + 1}${locale.month}`,
              })
            }

            columns.push({
              key: 'month',
              props: { children: months },
            })
            break
          }

          case 'day': {
            const minDay = (
              currentDate.getFullYear() === minDate.getFullYear() &&
              currentDate.getMonth() === minDate.getMonth()
            ) ? minDate.getDate() : 1

            const maxDay = (
              currentDate.getFullYear() === maxDate.getFullYear() &&
              currentDate.getMonth() === maxDate.getMonth()
            ) ? maxDate.getDate() : getDaysInMonth(currentDate)

            const days = []

            for (let i = minDay; i <= maxDay; i++) {
              days.push({
                value: `${i}`,
                label: `${i}${locale.day}`,
              })
            }

            columns.push({
              key: 'day',
              props: { children: days },
            })
            break
          }

          case 'hour': {
            let minHour = 0
            let maxHour = 23

            if (formatFields.includes('year') &&
              formatFields.includes('month') &&
              formatFields.includes('day')) {
              // 完整日期情况下，需要考虑当天的时分秒限制
              if (
                currentDate.getFullYear() === minDate.getFullYear() &&
                currentDate.getMonth() === minDate.getMonth() &&
                currentDate.getDate() === minDate.getDate()
              ) {
                minHour = minDate.getHours()
              }

              if (
                currentDate.getFullYear() === maxDate.getFullYear() &&
                currentDate.getMonth() === maxDate.getMonth() &&
                currentDate.getDate() === maxDate.getDate()
              ) {
                maxHour = maxDate.getHours()
              }
            } else {
              // 仅时间选择情况下
              minHour = minDate.getHours()
              maxHour = maxDate.getHours()
            }

            const hours = []

            // 处理12小时制特殊情况
            if (minHour === 0 && use12Hours) {
              hours.push({
                value: '0',
                label: `12${locale.hour}`,
              })
              minHour = 1
            }

            for (let i = minHour; i <= maxHour; i++) {
              hours.push({
                value: `${i}`,
                label: `${getDisplayHour(i)}${locale.hour}`,
              })
            }

            columns.push({
              key: 'hour',
              props: { children: hours },
            })
            break
          }

          case 'minute': {
            let minMinute = 0
            let maxMinute = 59
            const currentHour = currentDate.getHours()

            if (formatFields.includes('hour')) {
              if (
                currentDate.getFullYear() === minDate.getFullYear() &&
                currentDate.getMonth() === minDate.getMonth() &&
                currentDate.getDate() === minDate.getDate() &&
                currentHour === minDate.getHours()
              ) {
                minMinute = minDate.getMinutes()
              }

              if (
                currentDate.getFullYear() === maxDate.getFullYear() &&
                currentDate.getMonth() === maxDate.getMonth() &&
                currentDate.getDate() === maxDate.getDate() &&
                currentHour === maxDate.getHours()
              ) {
                maxMinute = maxDate.getMinutes()
              }
            }

            const minutes = []
            const currentMinute = currentDate.getMinutes()

            for (let i = minMinute; i <= maxMinute; i += minuteStep) {
              minutes.push({
                value: `${i}`,
                label: `${pad(i)}${locale.minute}`,
              })

              // 确保当前选中的分钟在选项中
              if (currentMinute > i && currentMinute < i + minuteStep) {
                minutes.push({
                  value: `${currentMinute}`,
                  label: `${pad(currentMinute)}${locale.minute}`,
                })
              }
            }

            columns.push({
              key: 'minute',
              props: { children: minutes },
            })
            break
          }

          case 'second': {
            let minSecond = 0
            let maxSecond = 59
            const currentHour = currentDate.getHours()
            const currentMinute = currentDate.getMinutes()

            if (formatFields.includes('hour') && formatFields.includes('minute')) {
              if (
                currentDate.getFullYear() === minDate.getFullYear() &&
                currentDate.getMonth() === minDate.getMonth() &&
                currentDate.getDate() === minDate.getDate() &&
                currentHour === minDate.getHours() &&
                currentMinute === minDate.getMinutes()
              ) {
                minSecond = minDate.getSeconds()
              }

              if (
                currentDate.getFullYear() === maxDate.getFullYear() &&
                currentDate.getMonth() === maxDate.getMonth() &&
                currentDate.getDate() === maxDate.getDate() &&
                currentHour === maxDate.getHours() &&
                currentMinute === maxDate.getMinutes()
              ) {
                maxSecond = maxDate.getSeconds()
              }
            }

            const seconds = []
            const currentSecond = currentDate.getSeconds()

            for (let i = minSecond; i <= maxSecond; i += secondStep) {
              seconds.push({
                value: `${i}`,
                label: `${pad(i)}${locale.second}`,
              })

              // 确保当前选中的秒在选项中
              if (currentSecond > i && currentSecond < i + secondStep) {
                seconds.push({
                  value: `${currentSecond}`,
                  label: `${pad(currentSecond)}${locale.second}`,
                })
              }
            }

            columns.push({
              key: 'second',
              props: { children: seconds },
            })
            break
          }

          case 'ampm': {
            columns.push({
              key: 'ampm',
              props: {
                children: [
                  { value: '0', label: locale.am },
                  { value: '1', label: locale.pm },
                ],
              },
            })
            break
          }
        }
      })

      return columns
    }

    // 获取当前选中的值
    const getSelectedValues = () => {
      const currentDate = getDate()
      return formatFields.map((field) => {
        switch (field) {
          case 'year':
            return `${currentDate.getFullYear()}`
          case 'month':
            return `${currentDate.getMonth()}`
          case 'day':
            return `${currentDate.getDate()}`
          case 'hour':
            return `${getDisplayHour(currentDate.getHours())}`
          case 'minute':
            return `${currentDate.getMinutes()}`
          case 'second':
            return `${currentDate.getSeconds()}`
          case 'ampm':
            return currentDate.getHours() >= 12 ? '1' : '0'
          default:
            return '0'
        }
      })
    }

    const columns = getPickerColumns()
    const selectedValues = getSelectedValues()

    return (
      <PickerView
        style={style}
        className={className}
        value={selectedValues}
        onChange={onValueChange}
        grow={grow}
      >
        {columns.map((column) => (
          <PickerViewColumn
            style={{ flex: 1 }}
            key={column.key}
            disabled={disabled}
            itemStyle={itemStyle}
          >
            {column.props.children.map((item) => (
              <PickerViewColumnItem key={item.value} value={item.value}>
                <View className='PickerView__item'>{item.label}</View>
              </PickerViewColumnItem>
            ))}
          </PickerViewColumn>
        ))}
      </PickerView>
    )
  }

  DatePicker_.getShowText = (value, props) => {
    if (props.timestamp) {
      return dayjs(+value).format(props.format)
    }
    return value
  }

  return DatePicker_
})

// 解析日期字符串
const parseDateString = (str, fmt) => {
  if (!str) return new Date()

  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(str) && +str > 1000) {
    return new Date(+str)
  }

  // 备用解析逻辑
  const values = {
    year: 2000,
    month: 0,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
  }

  // 提取各部分值
  const yearMatch = fmt.match(/YYYY/)
  if (yearMatch) {
    const idx = yearMatch.index
    values.year = parseInt(str.substr(idx, 4), 10) || 2000
  }

  const monthMatch = fmt.match(/MM/)
  if (monthMatch) {
    const idx = monthMatch.index
    values.month = (parseInt(str.substr(idx, 2), 10) || 1) - 1
  }

  const dayMatch = fmt.match(/DD/)
  if (dayMatch) {
    const idx = dayMatch.index
    values.day = parseInt(str.substr(idx, 2), 10) || 1
  }

  const hourMatch = fmt.match(/HH/)
  if (hourMatch) {
    const idx = hourMatch.index
    values.hour = parseInt(str.substr(idx, 2), 10) || 0
  }

  const minuteMatch = fmt.match(/mm/)
  if (minuteMatch) {
    const idx = minuteMatch.index
    values.minute = parseInt(str.substr(idx, 2), 10) || 0
  }

  const secondMatch = fmt.match(/ss/)
  if (secondMatch) {
    const idx = secondMatch.index
    values.second = parseInt(str.substr(idx, 2), 10) || 0
  }

  return new Date(
    values.year,
    values.month,
    values.day,
    values.hour,
    values.minute,
    values.second
  )
}


// 兼容旧的写法
const modes = {
  datetime: 'YYYY-MM-DD HH:mm',
  date: 'YYYY-MM-DD',
  time: 'HH:mm',
  month: 'YYYY-MM',
  year: 'YYYY'
}

