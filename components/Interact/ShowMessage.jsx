import { Text } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { asyncTimeOut, route, Animated, nextTick, pxNum, currentPage, TopView } from '@/duxapp'
import { getSystemInfoSync } from '@tarojs/taro'
import { BoxShadow } from '../BoxShadow'
import './ShowMessage.scss'

const ShowMessage = ({
  url,
  title,
  content,
  onTopViewRemove,
  onRemove
}) => {

  let { statusBarHeight = 0 } = getSystemInfoSync()

  if (!statusBarHeight) {
    statusBarHeight = 0
  }

  const [mainAn, setMainAn] = useState(Animated.defaultState)

  const an = useRef(null)

  useEffect(() => {
    nextTick(() => {
      if (!an.current) {
        an.current = Animated.create({
          duration: 100
        })
      }
      setMainAn(an.current.translateY(0).step().export())
    })
  }, [])

  const timer = useRef(null)

  useEffect(() => {
    const { remove } = route.onNavBefore(async (config, option) => {
      if (option.type === 'navigateTo') {
        onTopViewRemove?.()
        await asyncTimeOut(10)
      }
    })
    return () => remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(async () => {
      setMainAn(an.current.translateY(pxNum(-150)).step().export())
      await asyncTimeOut(150)
      onTopViewRemove?.()
    }, 3000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, url])

  useEffect(() => {
    return () => onRemove?.()
  }, [onRemove])

  return <Animated.View
    animation={mainAn}
    style={{ top: statusBarHeight + 10 }}
    className='ShowMessage'
  >
    <BoxShadow opacity={0.2} onClick={() => route.nav(url)} className='ShowMessage__main' radius={16}>
      <Text className='ShowMessage__title'>{title}</Text>
      {!!content && <Text className='ShowMessage__content'>{content}</Text>}
    </BoxShadow>
  </Animated.View>
}

/**
 * 在页面顶部显示一个提示消息，三秒后或者页面跳转时将会自动关闭
 * @param {string} title 提示标题
 * @param {string} content 提示详情
 * @param {string} url 点击跳转链接
 * @returns
 */
export const message = (() => {
  const pages = {}
  return (title, content, url) => {

    if (!title) {
      return console.log('message: 请传入标题')
    }

    const onClose = () => {
      pages[page].remove()
      delete pages[page]
    }

    const page = currentPage()
    const val = [
      ShowMessage,
      {
        title, content, url,
        onRemove: () => {
          delete pages[page]
        }
      }
    ]
    if (!pages[page]) {
      pages[page] = TopView.add(val)
    } else {
      pages[page].update(val)
    }

    return onClose
  }
})();
