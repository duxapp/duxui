import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { View } from '@tarojs/components'
import { stopPropagation } from '@/duxapp/utils'
import classNames from 'classnames'
import { TopView } from '@/duxapp'
import './index.scss'

const ModalContent = forwardRef(({ children, animation, overlayOpacity = 0.2, onClose }, ref) => {
  const [show, setShow] = useState(!animation)

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])

  useImperativeHandle(ref, () => ({
    hide() {
      setShow(false)
    }
  }))

  return <View onClick={onClose} className='modal-view' style={{ backgroundColor: show ? `rgba(0, 0, 0, ${overlayOpacity})` : 'rgba(0, 0, 0, 0)' }}>
    <View
      className={classNames('modal-view__main', {
        'modal-view__main--show': show
      })}
      onClick={stopPropagation}
    >
      {children}
    </View>
  </View>
})

export const Modal = ({ children, show, animation = true, maskClosable = true, overlayOpacity, onClose, group }) => {

  const action = useRef(null)

  const ref = useRef(null)

  const refs = useRef({})
  refs.current.onClose = onClose

  const close = useCallback(() => {
    if (maskClosable) {
      if (animation) {
        ref.current.hide()
        setTimeout(() => {
          refs.current.onClose?.()
          action.current.remove()
          action.current = null
        }, 200)
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
      const ele = <ModalContent ref={ref} animation={animation} onClose={close} overlayOpacity={overlayOpacity}>{children}</ModalContent>
      if (action.current) {
        action.current.update(ele)
      } else {
        action.current = TopView.add(ele, { group })
      }
    } else if (!show && action.current) {
      if (animation) {
        ref.current.hide()
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
