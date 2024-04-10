import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { Column } from '../Flex'
import './index.scss'

export const TouchableOpacity = ({ activeOpacity = 0.2, style, className, ...props }) => {

  const [touch, setTouch] = useState({ status: false, time: null })

  const start = useCallback(() => {
    setTouch({ status: true, time: Date.now() })
  }, [])

  const stop = useCallback(() => {
    setTouch(old => {
      if (old.stoping || !old.status) {
        return old
      }
      if (old.time && old.time + 200 > Date.now()) {
        setTimeout(() => {
          setTouch({ status: false })
        }, 200 - (Date.now() - old.time))
        return {
          status: true,
          stoping: true
        }
      }
      return {
        status: false
      }
    })
  }, [])

  return <Column
    {...props}
    style={{
      opacity: touch.status ? activeOpacity : 1,
      ...style,
    }}
    className={classNames('UITouchableOpacity', className)}
    onTouchEnd={stop}
    onTouchMove={stop}
    onTouchCancel={stop}
    onTouchStart={start}
  />
}
