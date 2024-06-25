import { Text } from '@tarojs/components'
import { useEffect, useRef } from 'react'
import { asyncTimeOut, nav, route } from '@/duxapp/utils'
import { BoxShadow } from '../BoxShadow'
import './ShowMessage.scss'

export const ShowMessage = ({
  url,
  title,
  content,
  onTopViewRemove
}) => {

  const { statusBarHeight = 0 } = global.systemInfo

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
    timer.current = setTimeout(() => {
      onTopViewRemove?.()
    }, 3000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, url])

  return <BoxShadow opacity={0.2} onClick={() => nav(url)} className='ShowMessage' radius={16} style={{ top: statusBarHeight + 10 }}>
    <Text className='ShowMessage__title'>{title}</Text>
    {!!content && <Text className='ShowMessage__content'>{content}</Text>}
  </BoxShadow>
}
