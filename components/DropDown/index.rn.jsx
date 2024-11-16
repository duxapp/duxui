import { useCallback, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { TouchableOpacity, View, Text, Dimensions } from 'react-native'
import { getSystemInfoSync } from '@tarojs/taro'
import { Absolute } from '@/duxapp'
import { DuxuiIcon } from '../DuxuiIcon'
import './index.scss'

const measureInWindow = ref => {
  return new Promise((resolve, reject) => {
    try {
      ref.measureInWindow?.((x, y, width, height) => {
        resolve({ x, y, width, height })
      })
    } catch (error) {
      reject()
    }
  })
}

export const DropDown = forwardRef(({
  children,
  renderContent,
  menuList,
  onSelect,
  rangeKey = 'text',
  select,
  style,
  ...props
}, ref) => {

  useImperativeHandle(ref, () => ({
    close: () => setShow(false)
  }))

  const view = useRef(null)

  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    opacity: 0
  })

  const click = useCallback(() => {
    if (menuList?.length === 1) {
      onSelect?.({ item: menuList[0], index: 1 })
      return
    }
    view.current.measureInWindow?.((x, y, width, height) => {
      const { statusBarHeight } = getSystemInfoSync()
      setPosition({ left: x, top: y + height + statusBarHeight, opacity: 0 })
      setShow(true)
    })
  }, [menuList, onSelect])

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

  const menuLayout = useCallback(e => {
    (async () => {
      const { layout } = e.nativeEvent
      const { width, height } = Dimensions.get('window')
      const newposition = { ...position, opacity: 1 }
      const { x, y, width: viewWidth, height: viewHeight } = await measureInWindow(view.current)
      if (position.left + layout.width > width) {
        newposition.left = width - layout.width - (width - x - viewWidth)
      }
      if (position.top + layout.height > height) {
        newposition.top = height - layout.height - (height - y - viewHeight)
      }
      setPosition(newposition)
    })()
  }, [position])

  return <>
    <TouchableOpacity style={style} {...props} onPress={click} activeOpacity={1} ref={view}>
      {children}
    </TouchableOpacity>
    {show && <Absolute>
      <TouchableOpacity className='DropDown__mask' onPress={close} activeOpacity={1} />
      <View className='DropDown__main' onLayout={menuLayout} style={position}>
        {
          renderContent ||
          menuList?.map((item, index) => {
            if (item.type === 'line') {
              return <View key={item[rangeKey] || item} className='DropDown__item--line' />
            }
            return <TouchableOpacity className={`DropDown__item${select === index ? ' DropDown__item--select' : ''}`} activeOpacity={1} key={item[rangeKey] || item} onPress={submit.bind(null, item, index)}>
              <Text className='DropDown__item__text'>{item[rangeKey] || item}</Text>
              {select === index && <DuxuiIcon name='direction_right' size={48} color='#F23E39' />}
            </TouchableOpacity>
          })
        }
      </View>
    </Absolute>}
  </>
})
