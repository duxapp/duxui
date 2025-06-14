import { Text as TaroText } from '@tarojs/components'
import { pxTransform } from '@tarojs/taro'
import classNames from 'classnames'
import { duxappTheme } from '@/duxapp'
import { createContext, memo, useContext } from 'react'
import './index.scss'

const context = /*@__PURE__*/ createContext({ child: false })

const isTexts = ['string', 'number', 'boolean', 'undefined']

export const Text = memo(({
  type,
  color,
  bold,
  size = 3,
  lineHeight = 1.4,
  underline,
  break: breakWord,
  numberOfLines,
  align,
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
  if (!child && !_style.lineHeight) {
    if (size < 8 && !child) {
      _style.lineHeight = pxTransform(duxappTheme[`textSize${size}`] * lineHeight)
    } else {
      _style.lineHeight = pxTransform(size * lineHeight)
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
    type && 'Text-' + type,
    typeof color === 'number' ? ('Text-c-' + color) : '',
    bold ?? bold ? 'Text-bold' : 'Text-nobold',
    breakWord && 'Text-break',
    size && size < 10 && 'Text-s-' + size,
    _delete && 'Text-delete',
    underline && 'Text-underline',
    grow && 'w-0 flex-grow',
    shrink && 'flex-shrink',
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
