import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { View } from '@tarojs/components'
import { nextTick } from '@/duxapp/utils'
import { Animated, TopView } from '@/duxapp'
import './index.scss'

const ModalContent = forwardRef(({ children, overlayOpacity = 0.2, onClose }, ref) => {

  const [mainAn, setMainAn] = useState(Animated.defaultState)

  const [maskAn, setMaskAn] = useState(Animated.defaultState)

  const an = useRef(null)

  const refs = useRef({})
  refs.current.onClose = onClose
  refs.current.overlayOpacity = overlayOpacity

  useImperativeHandle(ref, () => ({
    close: () => {
      setMainAn(an.current.scale(0.1).opacity(0.2).step().export())
      setMaskAn(an.current.opacity(0).step().export())
    }
  }))

  useEffect(() => {
    nextTick(() => {
      if (!an.current) {
        an.current = Animated.create({
          duration: 150,
          timingFunction: 'ease-out'
        })
      }
      setMainAn(an.current.scale(1).opacity(1).step().export())
      setMaskAn(an.current.opacity(refs.current.overlayOpacity).step().export())
    })
  }, [])

  return <View
    className='ModalView'
  >
    <Animated.View
      animation={maskAn}
      className='inset-0 absolute ModalView__mask'
    />
    <View
      className='inset-0 absolute'
      onClick={onClose}
    />
    <Animated.View
      animation={mainAn}
      className='ModalView__main'
    >
      {children}
    </Animated.View>
  </View>
})

export const Modal = ({ children, show, animation = true, maskClosable = true, overlayOpacity, onClose, group }) => {

  console.warn('Modal：组件将在不久后删除，请使用 PullView，有一样的功能')

  const action = useRef(null)

  const ref = useRef(null)

  const refs = useRef({})
  refs.current.onClose = onClose

  const close = useCallback(() => {
    if (maskClosable) {
      if (animation) {
        ref.current.close()
        setTimeout(() => {
          refs.current.onClose?.()
          action.current.remove()
          action.current = null
        }, 150)
      } else {
        refs.current.onClose?.()
        action.current.remove()
        action.current = null
      }
    }
  }, [maskClosable, animation])

  useEffect(() => {
    return () => {
      action.current?.remove?.()
    }
  }, [])

  useEffect(() => {
    if (show) {
      const ele = <ModalContent ref={ref} onClose={close} overlayOpacity={overlayOpacity}>{children}</ModalContent>
      if (action.current) {
        action.current.update(ele)
      } else {
        action.current = TopView.add(ele, { group })
      }
    } else if (!show && action.current) {
      if (animation) {
        ref.current.close()
        setTimeout(() => {
          action.current.remove()
          action.current = null
        }, 200)
      } else {
        action.current.remove()
        action.current = null
      }
    }
  }, [children, show, animation, overlayOpacity, close, group])

  return <></>
}
