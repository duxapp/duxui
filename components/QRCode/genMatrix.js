import { create } from 'qrcode/lib/browser'

export const ensureTextEncoder = () => {
  if (process.env.TARO_PLATFORM === 'mini') {
    if (typeof TextEncoder !== 'undefined') return
    const _global = typeof globalThis !== 'undefined'
      ? globalThis
      : (typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : null))
    if (!_global) return
    class TextEncoderPolyfill {
      encode(input = '') {
        const str = String(input)
        const bytes = []
        for (let i = 0; i < str.length; i++) {
          let codePoint = str.charCodeAt(i)
          if (codePoint >= 0xd800 && codePoint <= 0xdbff && i + 1 < str.length) {
            const next = str.charCodeAt(i + 1)
            if (next >= 0xdc00 && next <= 0xdfff) {
              codePoint = ((codePoint - 0xd800) << 10) + (next - 0xdc00) + 0x10000
              i++
            }
          }
          if (codePoint <= 0x7f) {
            bytes.push(codePoint)
          } else if (codePoint <= 0x7ff) {
            bytes.push(0xc0 | (codePoint >> 6))
            bytes.push(0x80 | (codePoint & 0x3f))
          } else if (codePoint <= 0xffff) {
            bytes.push(0xe0 | (codePoint >> 12))
            bytes.push(0x80 | ((codePoint >> 6) & 0x3f))
            bytes.push(0x80 | (codePoint & 0x3f))
          } else {
            bytes.push(0xf0 | (codePoint >> 18))
            bytes.push(0x80 | ((codePoint >> 12) & 0x3f))
            bytes.push(0x80 | ((codePoint >> 6) & 0x3f))
            bytes.push(0x80 | (codePoint & 0x3f))
          }
        }
        return new Uint8Array(bytes)
      }
    }
    _global.TextEncoder = TextEncoderPolyfill
  }
}

export default (value, errorCorrectionLevel) => {
  ensureTextEncoder()
  const arr = Array.prototype.slice.call(create(value, { errorCorrectionLevel }).modules.data, 0)
  const sqrt = Math.sqrt(arr.length)
  return arr.reduce((rows, key, index) => (index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, [])
}
