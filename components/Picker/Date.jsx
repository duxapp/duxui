import React from 'react'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import { PickerView, PickerViewColumn, PickerViewColumnItem } from './PickerView'
import './common.scss'

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function pad(n) {
  return n < 10 ? `0${n}` : n + ''
}

function cloneDate(date) {
  return new Date(+date)
}

function setMonth(date, month) {
  date.setDate(
    Math.min(
      date.getDate(),
      getDaysInMonth(new Date(date.getFullYear(), month)),
    ),
  )
  date.setMonth(month)
}

/**
 * 字符串格式化为时间
 * @param {*} str
 * @param {*} mode
 * @returns
 */
function formatTimeStr(str, mode) {
  let date = ''
  let time = ''
  if (mode === DATETIME) {
    if (!str) {
      str = dayjs().format('YYYY-MM-DD HH:mm')
    }
    const times = str.split(' ')
    date = times[0]
    time = times[1] || ''
  } else if (mode === TIME) {
    time = str || dayjs().format('HH:mm')
  } else {
    date = str || dayjs().format('YYYY-MM-DD')
  }
  let [year, month, day] = date.split('-')
  let [hour, minute] = time.split(':')
  year = ~~year || 2000
  month = ~~month || 1
  day = ~~day || 1
  hour = ~~hour
  minute = ~~minute
  return new Date(year, month - 1, day, hour, minute)
}

const DATETIME = 'datetime'
const DATE = 'date'
const TIME = 'time'
const MONTH = 'month'
const YEAR = 'year'
const ONE_DAY = 24 * 60 * 60 * 1000

export class DatePicker extends React.Component {
  static defaultProps = {
    locale: {
      year: '年',
      month: '月',
      day: '日',
      hour: '时',
      minute: '分',
      am: '上午',
      pm: '下午',
    },
    mode: DATE,
    disabled: false,
    minuteStep: 1,
    onDateChange() { },
    use12Hours: false,
  }

  state = {
    date: formatTimeStr(this.props.value || this.props.defaultValue, this.props.mode)
  }

  defaultMinDate
  defaultMaxDate

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ('date' in nextProps) {
      this.setState({
        date: formatTimeStr(nextProps.value || nextProps.defaultValue, nextProps.mode)
      })
    }
  }

  componentDidMount() {
    // 设置一个默认值
    if (!this.props.value) {
      this.propsChangeValue(this.state.date)
    }
  }

  propsChangeValue = newValue => {
    const { onChange, mode } = this.props
    if (onChange) {
      const yyyy = newValue.getFullYear() + ''
      const MM = ('0' + (newValue.getMonth() + 1)).slice(-2)
      const dd = ('0' + newValue.getDate()).slice(-2)
      const HH = ('0' + newValue.getHours()).slice(-2)
      const mm = ('0' + newValue.getMinutes()).slice(-2)
      if (mode === TIME) {
        onChange(`${HH}:${mm}`)
      } else {
        let ret = yyyy
        if (mode === DATETIME || mode === DATE || mode === MONTH) {
          ret += `-${MM}`
          if (mode === DATETIME || mode === DATE) {
            ret += `-${dd}`
            if (mode === DATETIME) {
              ret += ` ${HH}:${mm}`
            }
          }
        }
        onChange(ret)
      }
    }
  }

  getNewDate = (values, index) => {
    const value = parseInt(values[index], 10)
    const props = this.props
    const { mode } = props
    const newValue = cloneDate(this.getDate())
    if (mode === DATETIME || mode === DATE || mode === YEAR || mode === MONTH) {
      switch (index) {
        case 0:
          newValue.setFullYear(value)
          break
        case 1:
          // Note: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth
          // e.g. from 2017-03-31 to 2017-02-28
          setMonth(newValue, value)
          break
        case 2:
          newValue.setDate(value)
          break
        case 3:
          this.setHours(newValue, value)
          break
        case 4:
          newValue.setMinutes(value)
          break
        case 5:
          this.setAmPm(newValue, value)
          break
        default:
          break
      }
    } else if (mode === TIME) {
      switch (index) {
        case 0:
          this.setHours(newValue, value)
          break
        case 1:
          newValue.setMinutes(value)
          break
        case 2:
          this.setAmPm(newValue, value)
          break
        default:
          break
      }
    }
    return this.clipDate(newValue)
  }

  onValueChange = (values, index) => {
    const props = this.props
    const newValue = this.getNewDate(values, index)
    if (!('date' in props)) {
      this.setState({
        date: newValue,
      })
    }
    this.propsChangeValue(newValue)
  }

  onScrollChange = (values, index) => {
    const props = this.props
    if (props.onScrollChange) {
      const newValue = this.getNewDate(values, index)
      props.onScrollChange(newValue, values, index)
    }
  }

  setHours(date, hour) {
    if (this.props.use12Hours) {
      const dh = date.getHours()
      let nhour = hour
      nhour = dh >= 12 ? hour + 12 : hour
      nhour = nhour >= 24 ? 0 : nhour // Make sure no more than one day
      date.setHours(nhour)
    } else {
      date.setHours(hour)
    }
  }

  setAmPm(date, index) {
    if (index === 0) {
      date.setTime(+date - ONE_DAY / 2)
    } else {
      date.setTime(+date + ONE_DAY / 2)
    }
  }

  getDefaultMinDate() {
    if (!this.defaultMinDate) {
      this.defaultMinDate = new Date(2000, 0, 1, 0, 0, 0)
    }
    return this.defaultMinDate
  }

  getDefaultMaxDate() {
    if (!this.defaultMaxDate) {
      this.defaultMaxDate = new Date(2030, 0, 1, 23, 59, 59)
    }
    return this.defaultMaxDate
  }

  getDate() {
    return this.clipDate(
      this.state.date || this.props.defaultDate || this.getDefaultMinDate(),
    )
  }

  // used by rmc-picker/lib/PopupMixin.js
  getValue() {
    return this.getDate()
  }

  getMinYear() {
    return this.getMinDate().getFullYear()
  }

  getMaxYear() {
    return this.getMaxDate().getFullYear()
  }

  getMinMonth() {
    return this.getMinDate().getMonth()
  }

  getMaxMonth() {
    return this.getMaxDate().getMonth()
  }

  getMinDay() {
    return this.getMinDate().getDate()
  }

  getMaxDay() {
    return this.getMaxDate().getDate()
  }

  getMinHour() {
    return this.getMinDate().getHours()
  }

  getMaxHour() {
    return this.getMaxDate().getHours()
  }

  getMinMinute() {
    return this.getMinDate().getMinutes()
  }

  getMaxMinute() {
    return this.getMaxDate().getMinutes()
  }

  getMinDate() {
    if (this.props.minDate) {
      return formatTimeStr(this.props.minDate, this.props.mode)
    }
    return this.getDefaultMinDate()
  }

  getMaxDate() {
    if (this.props.maxDate) {
      return formatTimeStr(this.props.maxDate, this.props.mode)
    }
    return this.getDefaultMaxDate()
  }

  getDateData() {
    const { locale, formatMonth, formatDay, mode } = this.props
    const date = this.getDate()
    const selYear = date.getFullYear()
    const selMonth = date.getMonth()
    const minDateYear = this.getMinYear()
    const maxDateYear = this.getMaxYear()
    const minDateMonth = this.getMinMonth()
    const maxDateMonth = this.getMaxMonth()
    const minDateDay = this.getMinDay()
    const maxDateDay = this.getMaxDay()
    const years = []
    for (let i = minDateYear; i <= maxDateYear; i++) {
      years.push({
        value: i + '',
        label: i + locale.year + '',
      })
    }
    const yearCol = { key: 'year', props: { children: years } }
    if (mode === YEAR) {
      return [yearCol]
    }

    const months = []
    let minMonth = 0
    let maxMonth = 11
    if (minDateYear === selYear) {
      minMonth = minDateMonth
    }
    if (maxDateYear === selYear) {
      maxMonth = maxDateMonth
    }
    for (let i = minMonth; i <= maxMonth; i++) {
      const label = formatMonth
        ? formatMonth(i, date)
        : i + 1 + locale.month + ''
      months.push({
        value: i + '',
        label,
      })
    }
    const monthCol = { key: 'month', props: { children: months } }
    if (mode === MONTH) {
      return [yearCol, monthCol]
    }

    const days = []
    let minDay = 1
    let maxDay = getDaysInMonth(date)

    if (minDateYear === selYear && minDateMonth === selMonth) {
      minDay = minDateDay
    }
    if (maxDateYear === selYear && maxDateMonth === selMonth) {
      maxDay = maxDateDay
    }
    for (let i = minDay; i <= maxDay; i++) {
      const label = formatDay ? formatDay(i, date) : i + locale.day + ''
      days.push({
        value: i + '',
        label,
      })
    }
    return [yearCol, monthCol, { key: 'day', props: { children: days } }]
  }

  getDisplayHour(rawHour) {
    // 12 hour am (midnight 00:00) -> 12 hour pm (noon 12:00) -> 12 hour am (midnight 00:00)
    if (this.props.use12Hours) {
      if (rawHour === 0) {
        rawHour = 12
      }
      if (rawHour > 12) {
        rawHour -= 12
      }
      return rawHour
    }
    return rawHour
  }

  getTimeData(date) {
    let minHour = 0
    let maxHour = 23
    let minMinute = 0
    let maxMinute = 59
    const { mode, locale, minuteStep, use12Hours } = this.props
    const minDateMinute = this.getMinMinute()
    const maxDateMinute = this.getMaxMinute()
    const minDateHour = this.getMinHour()
    const maxDateHour = this.getMaxHour()
    const hour = date.getHours()
    if (mode === DATETIME) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const minDateYear = this.getMinYear()
      const maxDateYear = this.getMaxYear()
      const minDateMonth = this.getMinMonth()
      const maxDateMonth = this.getMaxMonth()
      const minDateDay = this.getMinDay()
      const maxDateDay = this.getMaxDay()
      if (
        minDateYear === year &&
        minDateMonth === month &&
        minDateDay === day
      ) {
        minHour = minDateHour
        if (minDateHour === hour) {
          minMinute = minDateMinute
        }
      }
      if (
        maxDateYear === year &&
        maxDateMonth === month &&
        maxDateDay === day
      ) {
        maxHour = maxDateHour
        if (maxDateHour === hour) {
          maxMinute = maxDateMinute
        }
      }
    } else {
      minHour = minDateHour
      if (minDateHour === hour) {
        minMinute = minDateMinute
      }
      maxHour = maxDateHour
      if (maxDateHour === hour) {
        maxMinute = maxDateMinute
      }
    }

    const hours = []
    if ((minHour === 0 && maxHour === 0) || (minHour !== 0 && maxHour !== 0)) {
      minHour = this.getDisplayHour(minHour)
    } else if (minHour === 0 && use12Hours) {
      minHour = 1
      hours.push({
        value: '0',
        label: locale.hour ? '12' + locale.hour : '12',
      })
    }
    maxHour = this.getDisplayHour(maxHour)
    for (let i = minHour; i <= maxHour; i++) {
      hours.push({
        value: i + '',
        label: locale.hour ? i + locale.hour + '' : pad(i),
      })
    }

    const minutes = []
    const selMinute = date.getMinutes()
    for (let i = minMinute; i <= maxMinute; i += minuteStep) {
      minutes.push({
        value: i + '',
        label: locale.minute ? i + locale.minute + '' : pad(i),
      })
      if (selMinute > i && selMinute < i + minuteStep) {
        minutes.push({
          value: selMinute + '',
          label: locale.minute
            ? selMinute + locale.minute + ''
            : pad(selMinute),
        })
      }
    }
    const cols = [
      { key: 'hours', props: { children: hours } },
      { key: 'minutes', props: { children: minutes } },
    ].concat(
      use12Hours
        ? [
          {
            key: 'ampm',
            props: {
              children: [
                { value: '0', label: locale.am },
                { value: '1', label: locale.pm },
              ],
            },
          },
        ]
        : [],
    )
    return { cols, selMinute }
  }

  clipDate(date) {
    const { mode } = this.props
    const minDate = this.getMinDate()
    const maxDate = this.getMaxDate()
    if (mode === DATETIME) {
      if (date < minDate) {
        return cloneDate(minDate)
      }
      if (date > maxDate) {
        return cloneDate(maxDate)
      }
    } else if (mode === DATE || mode === YEAR || mode === MONTH) {
      // compare-two-dates: https://stackoverflow.com/a/14629978/2190503
      if (+date + ONE_DAY <= minDate) {
        return cloneDate(minDate)
      }
      if (date >= +maxDate + ONE_DAY) {
        return cloneDate(maxDate)
      }
    } else if (mode === TIME) {
      const maxHour = maxDate.getHours()
      const maxMinutes = maxDate.getMinutes()
      const minHour = minDate.getHours()
      const minMinutes = minDate.getMinutes()
      const hour = date.getHours()
      const minutes = date.getMinutes()
      if (hour < minHour || (hour === minHour && minutes < minMinutes)) {
        return cloneDate(minDate)
      }
      if (hour > maxHour || (hour === maxHour && minutes > maxMinutes)) {
        return cloneDate(maxDate)
      }
    }
    return date
  }

  getValueCols() {
    const { mode, use12Hours } = this.props
    const date = this.getDate()
    let cols = []
    let value = []

    if (mode === YEAR) {
      return {
        cols: this.getDateData(),
        value: [date.getFullYear() + ''],
      }
    }

    if (mode === MONTH) {
      return {
        cols: this.getDateData(),
        value: [date.getFullYear() + '', date.getMonth() + ''],
      }
    }

    if (mode === DATETIME || mode === DATE) {
      cols = this.getDateData()
      value = [
        date.getFullYear() + '',
        date.getMonth() + '',
        date.getDate() + '',
      ]
    }

    if (mode === DATETIME || mode === TIME) {
      const time = this.getTimeData(date)
      cols = cols.concat(time.cols)
      const hour = date.getHours()
      let dtValue = [hour + '', time.selMinute + '']
      let nhour = hour
      if (use12Hours) {
        nhour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        dtValue = [nhour + '', time.selMinute + '', (hour >= 12 ? 1 : 0) + '']
      }
      value = value.concat(dtValue)
    }
    return {
      value,
      cols,
    }
  }

  render() {
    const { value, cols } = this.getValueCols()
    const { disabled, style, itemStyle, className, grow } = this.props
    return (
      <PickerView
        style={style}
        className={className}
        value={value}
        onChange={this.onValueChange}
        grow={grow}
      >
        {cols.map((p) => (
          <PickerViewColumn
            style={{ flex: 1 }}
            key={p.key}
            disabled={disabled}
            itemStyle={itemStyle}
          >
            {p.props.children.map((item) => {
              return (
                <PickerViewColumnItem key={item.value} value={item.value}>
                  <View className='PickerView__item'>
                    {item.label}
                  </View>
                </PickerViewColumnItem>
              )
            })}
          </PickerViewColumn>
        ))}
      </PickerView>
    )
  }
}
