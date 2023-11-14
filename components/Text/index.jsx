import { Text as TaroText } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { createContext, useContext } from 'react'
import './index.scss'

const context = createContext({ child: false })

export const Text = ({
  type,
  color,
  bold,
  size,
  underline,
  break: breakWord,
  numberOfLines,
  align,
  grow,
  shrink,
  self,
  className,
  style,
  ...props
}) => {

  const { child } = useContext(context)

  return <context.Provider value={{ child: true }}>
    <TaroText
      className={classNames(
        !child && 'Text',
        type && 'Text-' + type,
        typeof color === 'number' ? ('Text-c-' + color) : '',
        bold ?? bold ? 'Text-bold' : 'Text-nobold',
        breakWord && 'Text-break',
        size && size < 10 && 'Text-s-' + size,
        !child ? (size ? (size < 10 ? 'Text-s-l-' + size : '') : 'Text-s-l-3') : '',
        props.delete && 'Text-delete',
        underline && 'Text-underline',
        grow && 'w-0 flex-grow',
        shrink && 'flex-shrink',
        self && 'self-' + self,
        align && 'text-' + align,
        // 省略行数量
        process.env.TARO_ENV === 'rn' ? '' : numberOfLines === 1 ? 'Text-ellipsis' : numberOfLines > 1 ? 'Text-ellipsis--more' : '',
        className
      )}
      style={{
        ...style,
        ...size >= 12 ? { fontSize: Taro.pxTransform(size) } : {},
        ...size >= 12 && !child ? { lineHeight: Taro.pxTransform(size * 1.4) } : {},
        ...typeof color === 'string' ? { color } : {},
        ...(process.env.TARO_ENV !== 'rn' && numberOfLines > 1 ? {
          '-webkit-line-clamp': '' + numberOfLines
        } : {})
      }}
      {...(numberOfLines ? { numberOfLines: Number(numberOfLines) } : {})}
      {...props}
    />
  </context.Provider>
}
