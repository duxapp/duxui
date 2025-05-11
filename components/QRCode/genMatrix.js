import { create } from 'qrcode/lib/browser'

export default (value, errorCorrectionLevel) => {
  const arr = Array.prototype.slice.call(create(value, { errorCorrectionLevel }).modules.data, 0)
  const sqrt = Math.sqrt(arr.length)
  return arr.reduce((rows, key, index) => (index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, [])
}
