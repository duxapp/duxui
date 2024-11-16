const dateToStr = (formatStr = 'yyyy-MM-dd HH:mm:ss', date) => {
  date = timeStampToDate(date)
  let str = formatStr
  let Week = ['日', '一', '二', '三', '四', '五', '六']
  str = str.replace(/yyyy|YYYY/, date.getFullYear())
  str = str.replace(/yy|YY/, (date.getFullYear() % 100) > 9 ? (date.getFullYear() % 100).toString() : '0' + (date.getFullYear() % 100))
  str = str.replace(/MM/, date.getMonth() > 8 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1))
  str = str.replace(/M/g, (date.getMonth() + 1))
  str = str.replace(/w|W/g, Week[date.getDay()])

  str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate())
  str = str.replace(/d|D/g, date.getDate())

  str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours())
  str = str.replace(/h|H/g, date.getHours())
  str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes())
  str = str.replace(/m/g, date.getMinutes())

  str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds())
  str = str.replace(/s|S/g, date.getSeconds())

  return str
}

const timeStampToDate = (date = new Date()) => {
  //传入数字自动计算
  if (typeof date !== 'object') {
    date = String(date)
    const len = date.length
    if (len == 10) {
      date += '000'
      date = new Date(date * 1)
    } else if (len == 13) {
      date = new Date(date * 1)
    } else if (len < 10) {
      let num = (Array(10).join(0) + date).slice(-10)
      num += '000'
      date = new Date(num * 1)
    } else {
      date = new Date()
    }
  }
  return date
}

const dateAdd = (strInterval, num, date = new Date()) => {
  switch (strInterval) {
    case 's': return new Date(date.getTime() + (1000 * num))
    case 'n': return new Date(date.getTime() + (60000 * num))
    case 'h': return new Date(date.getTime() + (3600000 * num))
    case 'd': return new Date(date.getTime() + (86400000 * num))
    case 'w': return new Date(date.getTime() + ((86400000 * 7) * num))
    case 'm': return new Date(date.getFullYear(), (date.getMonth()) + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
    case 'y': return new Date((date.getFullYear() + num), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
  }
}

const strFormatToDate = (formatStr, dateStr) => {
  let year = 0
  let start = -1
  const len = dateStr.length
  if ((start = formatStr.indexOf('yyyy')) > -1 && start < len) {
    year = dateStr.substr(start, 4)
  }
  let month = 0
  if ((start = formatStr.indexOf('MM')) > -1 && start < len) {
    month = parseInt(dateStr.substr(start, 2)) - 1
  }
  let day = 0
  if ((start = formatStr.indexOf('dd')) > -1 && start < len) {
    day = parseInt(dateStr.substr(start, 2))
  }
  let hour = 0
  if (((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len) {
    hour = parseInt(dateStr.substr(start, 2))
  }
  let minute = 0
  if ((start = formatStr.indexOf('mm')) > -1 && start < len) {
    minute = dateStr.substr(start, 2)
  }
  let second = 0
  if ((start = formatStr.indexOf('ss')) > -1 && start < len) {
    second = dateStr.substr(start, 2)
  }
  return new Date(year, month, day, hour, minute, second)
}

const getMaxDay = (year, month) => {
  if (month == 4 || month == 6 || month == 9 || month == 11)
    return 30
  if (month == 2)
    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
      return 29
    else
      return 28
  return 31
}


export {
  dateToStr,
  dateAdd,
  getMaxDay,
  strFormatToDate
}
