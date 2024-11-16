import { useCallback, useState, forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { Layout, getRect, Absolute } from '@/duxapp'
import { getSystemInfoSync } from '@tarojs/taro'
import { DuxuiIcon } from '../DuxuiIcon'
import './index.scss'

let classKey = 0

export const DropDown = forwardRef(({
  children,
  renderContent,
  menuList,
  onSelect,
  rangeKey = 'text',
  select,
  className,
  ...props
}, ref) => {

  useImperativeHandle(ref, () => ({
    close: () => setShow(false)
  }))

  const currentClass = useMemo(() => `dropdown-${classKey++}`, [])

  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    opacity: 0
  })

  const clickSize = useRef({ left: 0, top: 0 })

  const click = useCallback(() => {
    if (menuList?.length === 1) {
      onSelect?.({ item: menuList[0], index: 1 })
      return
    }
    getRect('.' + currentClass).then(res => {
      clickSize.current = { left: res.left, top: res.top + res.height }
      setShow(true)
    })
  }, [currentClass, menuList, onSelect])

  const close = useCallback(() => {
    setShow(false)
  }, [])

  const submit = useCallback((item, index) => {
    if (select === index) {
      return
    }
    setShow(false)
    setTimeout(() => {
      onSelect?.({ item, index })
    }, 150)
  }, [onSelect, select])

  const menuLayout = useCallback(layout => {
    (async () => {
      const { windowWidth: width, windowHeight: height } = getSystemInfoSync()
      const newposition = { ...clickSize.current, opacity: 1 }
      // 此处需要修改
      const { left: x, top: y, width: viewWidth, height: viewHeight } = await getRect('.' + currentClass)

      if (clickSize.current.left + layout.width > width) {
        newposition.left = width - layout.width - (width - x - viewWidth)
      }
      if (clickSize.current.top + layout.height > height) {
        newposition.top = height - layout.height - (height - y - viewHeight)
      }
      setPosition(newposition)
    })()
  }, [currentClass])

  return <>
    <View className={`${className} ${currentClass}`} {...props} onClick={click}>
      {children}
    </View>
    {show && <Absolute>
      <View className='DropDown__mask' onClick={close} />
      <Layout className='DropDown__main' onLayout={menuLayout} style={position}>
        {
          renderContent ||
          menuList?.map((item, index) => {
            if (item.type === 'line') {
              return <View key={index} className='DropDown__item--line ' />
            }
            return <View className={`DropDown__item${select === index ? ' DropDown__item--select' : ''}`} key={item[rangeKey] || item} onClick={submit.bind(null, item, index)}>
              <Text className='DropDown__item__text'>{item[rangeKey] || item}</Text>
              {select === index && <DuxuiIcon name='direction_right' size={48} className='text-primary' />}
            </View>
          })
        }
      </Layout>
    </Absolute>}
  </>
})
