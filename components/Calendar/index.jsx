import { useCallback, useMemo, useState, useEffect, isValidElement, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { dayjs, deepEqua, toast, useDeepObject } from '@/duxapp'
import classNames from 'classnames'
import { dateAdd, dateToStr, getMaxDay, strFormatToDate } from './date'
import { DuxuiIcon } from '../DuxuiIcon'
import './index.scss'

export const Calendar = ({
  mode, // day日期选择 week周选择 scope范围选择
  value: propsValue = '',// 周或者范围选择传入数组，第一项开始时间，第二项结束时间
  checkbox,
  navStyle,
  headStyle,
  style,
  className,
  onChange,
  onDayClick,
  onMonthChange,
  disabledDate,
  enabledDate,
  customDate,
  customSelect,
  max,
  min,
  onlyCurrentWeek, // 仅显示当前这周的数据
  ...props
}) => {

  const [value, setValue] = useState(checkbox && !propsValue ? [] : propsValue)

  const valueRef = useRef(value)
  valueRef.current = value

  const refs = useRef({})
  refs.current.onChange = onChange
  refs.current.onDayClick = onDayClick

  // 将单选和多选统一按照多选处理 单日选择处理为范围 当天到当天的范围
  const values = useMemo(() => (checkbox ? value : value ? [value] : []).map(item => typeof item === 'string' ? [item, item] : item), [checkbox, value])

  const [month, setMonth] = useState(() => {
    const _value = checkbox ? value[0] : value
    return _value && _value[0] ? (typeof _value === 'object' ? _value[0] : _value).split('-').filter((v, i) => i < 2).join('-') : dateToStr('yyyy-MM')
  })

  const [scopeStart, setScopeStart] = useState('')

  const onMonthChangeRef = useRef(onMonthChange)
  onMonthChangeRef.current = onMonthChange

  useEffect(() => {
    onMonthChangeRef.current?.(month)
  }, [month])

  useMemo(() => {
    if (deepEqua(valueRef.current, propsValue) || !propsValue) {
      return
    }
    setValue(checkbox && !propsValue ? [] : propsValue)
  }, [checkbox, propsValue])

  const deepData = useDeepObject({
    disabledDate,
    enabledDate
  })

  /**
   * 序列化禁用日期数据
   */
  const [disabledDateCache, enanledDateCache] = useMemo(() => {
    return [deepData.disabledDate || [], deepData.enabledDate || []].map(item => {
      return item.reduce((prev, current) => {
        if (Array.isArray(current) && current.length === 2) {
          prev.push(current.map(v => strFormatToDate('yyyy-MM-dd', v).getTime()).sort((a, b) => a - b))
        } else if (typeof current === 'string') {
          const time = strFormatToDate('yyyy-MM-dd', current).getTime()
          prev.push([time, time])
        }
        return prev
      }, [])
    })
  }, [deepData.disabledDate, deepData.enabledDate])

  const isDisabled = useCallback(dayTime => {
    return disabledDateCache.some(([start, end]) => dayTime >= start && dayTime <= end)
      || (enabledDate && !enanledDateCache.some(([start, end]) => dayTime >= start && dayTime <= end))
  }, [disabledDateCache, enabledDate, enanledDateCache])

  /**
   * 序列化自定义数据
   */
  const customDateCache = useMemo(() => {
    return customDate?.reduce((prev, { date, ...config }) => {
      date.forEach(item => {
        if (Array.isArray(item) && item.length === 2) {
          const dates = item.map(v => strFormatToDate('yyyy-MM-dd', v).getTime()).sort((a, b) => a - b)
          for (let i = dates[0]; i <= dates[1]; i += 24 * 60 * 60 * 1000) {
            const day = dateToStr('yyyy-MM-dd', i)
            prev[day] = {
              config: prev[day]?.config ? { ...prev[day]?.config, ...config } : config,
              customType: dates[0] === dates[1]
                ? 'select' : i === dates[0] ?
                  'start' : i === dates[1] ?
                    'end' : 'center'
            }
          }
        } else {
          prev[item] = {
            config: prev[item]?.config ? { ...prev[item]?.config, ...config } : config,
            customType: prev[item]?.customType || 'select'
          }
        }
      })
      return prev
    }, {})
  }, [customDate])

  const getCustomConfig = useCallback(config => {
    if (!customDateCache) {
      return
    }
    const day = `${month}-${(config.text + '').padStart(2, '0')}`
    const userConfig = customDateCache[day]?.config
    const getRes = render => {
      if (typeof render === 'undefined') {
        return
      }
      if (typeof render === 'string' || isValidElement(render) || render?.__proto__ === Object.prototype) {
        return render
      }
      return render({ ...config, date: day, customType: customDateCache[day]?.customType })
    }
    const _config = {}
    if (userConfig) {
      if (userConfig.text) {
        _config.text = getRes(userConfig.text)
      }
      if (userConfig.top) {
        _config.renderTop = getRes(userConfig.top)
      }
      if (userConfig.bottom) {
        _config.renderBottom = getRes(userConfig.bottom)
      }
      if (userConfig.style) {
        _config.customStyle = getRes(userConfig.style)
      }
      if (userConfig.textStyle) {
        _config.textStyle = getRes(userConfig.textStyle)
      }
      _config.customType = customDateCache[day].customType
    }
    if (config.selectType) {
      if (customSelect?.text) {
        _config.text = getRes(customSelect.text)
      }
      if (customSelect?.top) {
        _config.renderTop = getRes(customSelect.top)
      }
      if (customSelect?.bottom) {
        _config.renderBottom = getRes(customSelect.bottom)
      }
      if (customSelect?.style) {
        _config.style = getRes(customSelect.style)
      }
      if (customSelect?.textStyle) {
        _config.textStyle = getRes(customSelect.textStyle)
      }
    }
    return _config
  }, [customDateCache, customSelect?.bottom, customSelect?.style, customSelect?.text, customSelect?.textStyle, customSelect?.top, month])

  const list = useMemo(() => {
    const firstDay = `${month}-01`
    const firstWeek = dateToStr('W', strFormatToDate('yyyy-MM-dd', firstDay))
    const maxDay = getMaxDay(...month.split('-').map(v => +v))

    // 上个月需要补齐的天数
    const lastMonthDys = weeks.indexOf(firstWeek)

    // 算出上个月的最大天数
    const lastMaxDay = getMaxDay(...dateToStr('yyyy-MM', getMouth(month, -1)).split('-').map(v => +v))

    // 下个月需要补齐的天数
    const nextMonthDys = 7 - (lastMonthDys + maxDay) % 7

    const arr = weeks.map(val => ({ text: val, disable: true }))

    for (let i = lastMonthDys; i > 0; i--) {
      arr.push({
        text: false ? lastMaxDay - i + 1 : '',
        disable: true
      })
    }

    // 是否超出最大最小月份
    const beyond = (() => {
      if (max && strFormatToDate('yyyy-MM-dd', firstDay) > strFormatToDate('yyyy-MM-dd', max)) {
        return true
      }
      if (min && strFormatToDate('yyyy-MM-dd', `${month}-${maxDay}`) < strFormatToDate('yyyy-MM-dd', min)) {
        return true
      }
      return false
    })()

    const isDsiable = day => {
      const time = strFormatToDate('yyyy-MM-dd', `${month}-${day}`)
      // 用户禁用
      if (isDisabled(time.getTime())) {
        return true
      }

      if (max && time > strFormatToDate('yyyy-MM-dd', max)) {
        return true
      }
      if (min && time < strFormatToDate('yyyy-MM-dd', min)) {
        return true
      }
      return false
    }

    const scopes = values.map(val => val.map(str => dayjs(str).unix()))

    const getSelectType = unix => {
      const scope = scopes.find(item => item[0] <= unix && item[1] >= unix)
      if (!scope) {
        return ''
      }
      return unix === scope[0] && unix === scope[1] ?
        'select' : unix === scope[0] ?
          'start' : unix === scope[1] ?
            'end' : 'center'
    }
    // 范围选择时，判断是value所在的月份
    const scopeDates = scopeStart ? scopeStart.split('-') : null

    for (let i = 0; i < maxDay; i++) {
      const currentDate = dayjs(`${month}-${i + 1}`).unix()
      const selectType = getSelectType(currentDate)
      const config = {
        text: i + 1,
        select: !!selectType,
        selectType: selectType,
        disable: beyond || isDsiable(i + 1)
      }
      if (scopeStart) {
        const isSelect = +scopeDates[2] === i + 1 && scopeDates.slice(0, 2).join('-') === month
        if (isSelect) {
          config.select = true
          config.selectType = 'start'
        }
      }
      arr.push({
        ...config,
        ...getCustomConfig(config)
      })
    }

    if (nextMonthDys < 7) {
      for (let i = 0; i < nextMonthDys; i++) {
        arr.push({
          text: false ? i + 1 : '',
          disable: true
        })
      }
    }

    return arr.reduce((prev, current, index) => {
      const i = index / 7 | 0
      prev[i] = prev[i] || []
      prev[i].push(current)
      return prev
    }, [])

  }, [month, values, scopeStart, max, min, isDisabled, getCustomConfig])

  const prev = useCallback(() => {
    setMonth(old => dateToStr('yyyy-MM', getMouth(old, -1)))
  }, [])

  const next = useCallback(() => {
    setMonth(old => dateToStr('yyyy-MM', getMouth(old, 1)))
  }, [])

  const click = useCallback(({
    text,
    disable
  }) => {
    const day = `${month}-${+text < 10 ? '0' + text : text}`
    if (refs.current.onDayClick?.({
      day,
      scopeStart
    }) || disable) {
      return
    }

    if (mode === 'day') {
      if (checkbox) {
        const _value = [...value]
        const i = _value.indexOf(day)
        if (~i) {
          _value.splice(i, 1)
        } else {
          _value.push(day)
        }
        setValue(_value)
        refs.current.onChange?.(_value)
      } else {
        setValue(day)
        refs.current.onChange?.(day)
      }
    } else if (mode === 'week') {
      // 判断当前周所有日期是否被禁用
      const val = Calendar.getWeekScopeForDay(day)
      const dates = val.map(v => strFormatToDate('yyyy-MM-dd', v).getTime())
      for (let i = dates[0]; i <= dates[1]; i += 24 * 60 * 60 * 1000) {
        if (isDisabled(i)) {
          return toast('范围不可选')
        }
      }
      if (checkbox) {
        const _value = [...value]
        const i = _value.findIndex(v => v.toString() === val.toString())
        if (~i) {
          _value.splice(i, 1)
        } else {
          _value.push(val)
        }
        setValue(_value)
        refs.current.onChange?.(_value)
      } else {
        setValue(val)
        refs.current.onChange?.(val)
      }
    } else if (mode === 'scope') {
      if (!scopeStart) {
        if (checkbox) {
          // 检查点击的是不是已经被选中的范围，是的话取消此选中
          const i = value.findIndex(v => Calendar.checkDatesOverlap([day, day], v))
          if (~i) {
            const _value = [...value]
            _value.splice(i, 1)
            setValue(_value)
            return
          }
        } else {
          setValue([])
          refs.current.onChange?.([])
        }
        setScopeStart(day)
      } else {
        let val = [scopeStart, day]
        if (strFormatToDate('yyyy-MM-dd', val[0]) > strFormatToDate('yyyy-MM-dd', val[1])) {
          val = [day, scopeStart]
        }
        const dates = val.map(v => strFormatToDate('yyyy-MM-dd', v).getTime())
        for (let i = dates[0]; i <= dates[1]; i += 24 * 60 * 60 * 1000) {
          if (isDisabled(i)) {
            return toast('范围不可选')
          }
        }
        if (checkbox) {
          // 检查是否和当前选中的日期有重叠
          if (value.some(v => Calendar.checkDatesOverlap(val, v))) {
            return toast('范围有重叠')
          }
          const _value = [...value]
          _value.push(val)
          setValue(_value)
          refs.current.onChange?.(_value)
        } else {
          setValue(val)
          refs.current.onChange?.(val)
        }
        setScopeStart('')
      }
    }
  }, [month, mode, checkbox, value, isDisabled, scopeStart])

  const [selectDay, selelctOfWeekIndex] = useMemo(() => {
    let val
    if (!values.length) {
      val = dateToStr('yyyy-MM-dd')
    } else {
      val = values[0][0]
    }
    if (!onlyCurrentWeek) {
      return [val, 0]
    }
    const [y, m, w] = Calendar.getMonthWeekForDay(val)
    return [`${y}-${(m > 9 ? 0 : '0') + m}`, w]
  }, [values, onlyCurrentWeek])

  useEffect(() => {
    if (onlyCurrentWeek) {
      // 将月份重置为当前月份
      const _month = selectDay.substr(0, 7)
      if (month !== _month) {
        setMonth(_month)
      }
    }
  }, [onlyCurrentWeek, selectDay, month])

  return <View className={classNames('Calendar', className)} style={style}
    {...props}
  >
    {!onlyCurrentWeek && <View className='Calendar__head' style={navStyle}>
      <DuxuiIcon name='direction_left' className='Calendar__head__icon' onClick={prev} />
      <Text className='Calendar__head__text'>{month}</Text>
      <DuxuiIcon name='direction_right' className='Calendar__head__icon' onClick={next} />
    </View>}
    {
      list.map((week, index) => {
        if (onlyCurrentWeek && selelctOfWeekIndex !== index && index) {
          return null
        }
        return <View className='Calendar__row' key={index} style={!index ? headStyle : undefined}>
          {
            week.map((day, dayIndex) => <Day
              header={!index}
              key={day.text + '-' + dayIndex}
              week={dayIndex + 1}
              {...day}
              onClick={click}
            />)
          }
        </View>
      })
    }
  </View>
}

/**
 * 获取上月或者下月 的日期对象 会返回那个月一号的日期对象
 * @param {*} current
 * @param {*} num
 */
const getMouth = (current, num) => {
  const day = (current + '-01').split('-')
  if (num > 0) {
    if (+day[1] === 11) {
      day[1] = 0
      day[0] = +day[0] + 1
    } else {
      day[1] = +day[1] + 1
    }
  } else {
    if (+day[1] === 0) {
      day[1] = 11
      day[0] = +day[0] - 1
    } else {
      day[1] = +day[1] - 1
    }
  }
  return strFormatToDate('yyyy-MM-dd', day.join('-'))
}

const weeks = ['一', '二', '三', '四', '五', '六', '日']

const Day = ({
  text,
  header,
  disable,
  onClick,
  select,
  selectType,
  week,
  renderTop,
  renderBottom,
  style,
  textStyle,
  customStyle,
  customType
}) => {

  const click = useCallback(() => {
    onClick({
      text,
      disable,
      week
    })
  }, [onClick, text, disable, week])

  return <View className={classNames('Calendar__row__item', header && 'Calendar__row__item--head')} onClick={click}>
    {customType && <View
      className={`Calendar__row__item__custom Calendar__row__item__custom--${customType}`}
      style={customStyle}
    />}
    {select && <View
      style={style}
      className={`Calendar__row__item__select Calendar__row__item__select--${selectType}`}
    />}
    <Text
      className={`Calendar__row__item__text${disable ? ' Calendar__row__item__text--disable' : ''}`}
      style={select ? { color: '#fff', ...textStyle } : textStyle}
    >{text}</Text>
    {(renderTop || renderBottom) && <View className='Calendar__row__item__other'>
      <View className='Calendar__row__item__other__item'>{renderTop}</View>
      <View className='Calendar__row__item__other__item'>{renderBottom}</View>
    </View>}
  </View>
}

/**
 * 计算这个日期是第几月的第几周
 * @param {*} day
 */
Calendar.getMonthWeekForDay = day => {
  const dayNum = +day.split('-')[2]
  const month = day.split('-').filter((v, i) => i < 2).join('-')
  const firstDay = month + '-01'
  const firstWeek = dateToStr('W', strFormatToDate('yyyy-MM-dd', firstDay))
  const maxDay = getMaxDay(...month.split('-').map(v => +v))

  // 上个月需要补齐的天数
  const lastMonthDys = weeks.indexOf(firstWeek)

  // 下个月需要补齐的天数
  const nextMonthDys = 7 - (lastMonthDys + maxDay) % 7
  const week = Math.ceil((lastMonthDys + dayNum) / 7)
  const maxWeek = Math.ceil((lastMonthDys + maxDay) / 7)
  if (week === maxWeek && nextMonthDys > 0) {
    // 下个月第一周
    const next = getMouth(month, 1)
    return [next.getFullYear(), next.getMonth() + 1, 1]
  }
  return [...month.split('-').map(v => +v), week]
}

/**
 * 计算指定日期所在的周的第一天和最后一天
 * @param {*} day
 */
Calendar.getWeekScopeForDay = day => {
  const date = strFormatToDate('yyyy-MM-dd', day)
  const before = weeks.indexOf(dateToStr('W', strFormatToDate('yyyy-MM-dd', day)))
  const after = 7 - before - 1
  return [dateToStr('yyyy-MM-dd', dateAdd('d', -before, date)), dateToStr('yyyy-MM-dd', dateAdd('d', after, date))]
}

/**
 * 计算指定日期所在的月的第一天和最后一天
 * @param {*} day
 */
Calendar.getMouthScopeForDay = day => {
  const month = day.split('-').filter((v, i) => i < 2).join('-')
  const lastMaxDay = getMaxDay(...month.split('-').map(v => +v))

  return [`${month}-01`, `${month}-${lastMaxDay}`]
}

/**
 * 检查两个日期范围是否有重叠
 * @param {*} range1
 * @param {*} range2
 */
Calendar.checkDatesOverlap = (range1, range2) => {
  const [
    a, b,
    c, d
  ] = [...range1, ...range2].map(v => dayjs(v).unix())

  return a <= d && b >= c
}
