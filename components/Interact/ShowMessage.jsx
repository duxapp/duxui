import { Text } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { asyncTimeOut, nav, route, Animated, nextTick, pxNum } from '@/duxapp'
import { getSystemInfoSync } from '@tarojs/taro'
import { BoxShadow } from '../BoxShadow'
import './ShowMessage.scss'

export const ShowMessage = ({
  url,
  title,
  content,
  onTopViewRemove
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

  return <Animated.View
    animation={mainAn}
    style={{ top: statusBarHeight + 10 }}
    className='ShowMessage'
  >
    <BoxShadow opacity={0.2} onClick={() => nav(url)} className='ShowMessage__main' radius={16}>
      <Text className='ShowMessage__title'>{title}</Text>
      {!!content && <Text className='ShowMessage__content'>{content}</Text>}
    </BoxShadow>
  </Animated.View>
}
