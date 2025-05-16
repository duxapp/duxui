/**
 * 10进制转为64进制
 * @param {*} number
 * @returns
 */
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const to62 = number => {
  let radix = chars.length,
    qutient = +number,
    arr = [],
    mod
  do {
    mod = qutient % radix
    qutient = (qutient - mod) / radix
    arr.unshift(chars[mod])
  } while (qutient)
  return arr.join('')
}

let oldTime = 0
export const getKey = () => {
  const time = Date.now()
  if (time <= oldTime) {
    ++oldTime
  } else {
    oldTime = time
  }
  return to62(oldTime)
}
