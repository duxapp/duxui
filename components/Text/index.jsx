import { Text as TaroText } from '@tarojs/components'
import { pxTransform } from '@tarojs/taro'
import classNames from 'classnames'
import { duxappTheme, px } from '@/duxapp'
import { createContext, memo, useContext } from 'react'
import './index.scss'

const context = /*@__PURE__*/ createContext({ child: false })

const isTexts = ['string', 'number', 'boolean', 'undefined']

export const Text = memo(({
  type,
  color,
  bold,
  size,
  lineHeight = 1.4,
  underline,
  break: breakWord,
  numberOfLines,
  align,
  nowrap,
  grow,
  shrink,
  self,
  className,
  style,
  children,
  delete: _delete,
  ...props
}) => {

  const { child } = useContext(context)

  const _style = { ...style }

  if (size >= 12) {
    _style.fontSize = pxTransform(size)
  }
  let lineHeightClass = ''
  if (!child && !_style.lineHeight) {
    const s = size ?? 3
    let lh = s * lineHeight
    if (s < 8) {
      lh = duxappTheme[`textSize${s}`] * lineHeight
    }
    if (lh > 54 || lh < 22) {
      _style.lineHeight = px(lh)
    } else {
      lineHeightClass = 'Text-l-' + findClosestNumber(lineArr, lh)
    }
  }

  if (typeof color === 'string') {
    _style.color = color
  }

  if (process.env.TARO_ENV !== 'rn' && numberOfLines > 1) {
    _style.WebkitLineClamp = numberOfLines
  }

  const cn = classNames(
    !child && 'Text',
    lineHeightClass,
    type && 'Text-' + type,
    typeof color === 'number' ? ('Text-c-' + color) : '',
    bold ?? bold ? 'Text-bold' : 'Text-nobold',
    breakWord && 'Text-break',
    size && size < 10 && 'Text-s-' + size,
    _delete && 'Text-delete',
    underline && 'Text-underline',
    grow && 'w-0 flex-grow',
    shrink && 'flex-shrink',
    nowrap && 'Text-nowrap',
    self && 'self-' + self,
    align && 'text-' + align,
    // 省略行数量
    process.env.TARO_ENV === 'rn'
      ? '' : numberOfLines === 1
        ? 'Text-ellipsis'
        : numberOfLines > 1
          ? 'Text-ellipsis--more'
          : '',
    className
  )

  const render = <TaroText
    className={cn}
    style={_style}
    {...(numberOfLines ? { numberOfLines: Number(numberOfLines) } : {})}
    {...props}
  >{children}</TaroText>

  if (!children || isTexts.includes(typeof children)) {
    return render
  }

  return <context.Provider value={{ child: true }}>
    {render}
  </context.Provider>
})

const lineArr = [24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58]

const findClosestNumber = (arr, target) => {
  if (arr.length === 0) return null;

  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  // 检查 left 和 left-1 哪个更接近
  if (left > 0 && Math.abs(target - arr[left - 1]) < Math.abs(target - arr[left])) {
    return arr[left - 1];
  } else {
    return arr[left];
  }
}
