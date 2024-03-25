import { useMemo, isValidElement, useState, useCallback } from 'react'
import { duxappTheme, noop, px } from '@/duxapp'
import classNames from 'classnames'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'

export const NumberKeyboard = ({
  onKeyPress,
  onBackspace = noop,
  random,
  keyLeft,
  keyRight = 'backspace',
  className,
  style,
  ...props
}) => {

  const lines = useMemo(() => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    if (random) {
      numbers = numbers.sort(() => Math.random() - 0.5)
    }
    return [
      ...numbers.slice(0, 9),
      keyLeft,
      numbers[9],
      keyRight === 'backspace' ?
        { key: 'backspace', render: <DuxuiIcon name='backspace' size={46} color={duxappTheme.textColor1} />, onClick: onBackspace } :
        keyRight
    ].map(item => {
      if (typeof item === 'object') {
        item = { ...item }
        if (!item.onClick) {
          item.onClick = () => onKeyPress?.('' + item.key)
        }
        if (!isValidElement(item.render)) {
          item.render = <Text size={7}>{item.render ?? item.key}</Text>
        }
        if (!item.width) {
          item.width = 1
        }
        return item
      }
      return {
        key: item,
        render: <Text size={7}>{item}</Text>,
        onClick: () => onKeyPress?.('' + item)
      }
    }).reduce((prev, current, index) => {
      const i = index / 3 | 0
      if (!prev[i]) {
        prev[i] = []
      }
      prev[i].push(current)
      return prev
    }, [])
  }, [keyLeft, keyRight, onBackspace, onKeyPress, random])

  return <Column className={classNames('gap-2 p-2', className)} style={style} {...props}>
    {
      lines.map((line, lineIndex) => <Row className='gap-2' key={lineIndex}>
        {line.map((item) => <KeyItem key={item.key} keyText={item.key} {...item} />)}
      </Row>)
    }
  </Column>
}

const KeyItem = ({ keyText, onClick, render, height = 1 }) => {

  const [touch, setTouch] = useState({ status: false, time: null })

  const start = useCallback(() => {
    setTouch({ status: true, time: Date.now() })
  }, [])

  const stop = useCallback(() => {
    setTouch(old => {
      if (old.stoping || !old.status) {
        return old
      }
      if (old.time && old.time + 100 > Date.now()) {
        setTimeout(() => {
          setTouch({ status: false })
        }, 100 - (Date.now() - old.time))
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

  if (typeof keyText === 'undefined') {
    return <Column
      items='center'
      justify='center'
      grow
      className='r-1'
      style={{
        height: px(height * 90 + (height - 1) * 16)
      }}
    />
  }

  return <Column
    items='center'
    justify='center'
    grow
    className='r-1'
    style={{
      backgroundColor: touch.status ? '#EBEDF0' : '#fff',
      height: px(height * 90 + (height - 1) * 16)
    }}
    onClick={onClick}
    onTouchEnd={stop}
    onTouchMove={stop}
    onTouchCancel={stop}
    onTouchStart={start}
  >
    {render}
  </Column>
}

NumberKeyboard.useController = ({
  defaultValue = '',
  number
} = {}) => {

  const [text, setText] = useState(defaultValue)

  const onKeyPress = useCallback(key => {
    setText(old => old + key)
  }, [])

  const onBackspace = useCallback(() => {
    setText(old => old.substring(0, old.length - 1))
  }, [])

  return [number ? +text : text, {
    onKeyPress,
    onBackspace
  }]
}
