import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import './InputCode.scss'

export const InputCode = ({
  value = '', onChange,
  itemStyle, length = 6, password, focus,
  className, style,
  ...props
}) => {

  const arr = useMemo(() => {
    const _value = '' + value
    return Array(length).fill(0).map((v, i) => {
      return _value[i] || ''
    })
  }, [length, value])

  return <Row
    className={classNames('InputCode', className)}
    style={style} justify='between'
    {...props}
  >
    {
      arr.map((item, index) => <Item
        style={itemStyle} key={index} value={item} password={password}
        focus={focus && !item && (!!arr[index - 1] || !index)}
      />)
    }
  </Row>
}

const Item = ({ value, password, focus, style }) => {

  return <Column className='InputCode__item' grow items='center' justify='center' style={style}>
    {
      focus ?
        <Focus /> : value ?
          (password ? <Column className='InputCode__password' /> : <Text size={7}>{value}</Text>)
          : null
    }
  </Column>
}

const Focus = () => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setShow(old => !old)
    }, 800)

    return () => clearInterval(timer)
  }, [])

  if (show) {
    return <Column className='InputCode__focus' />
  }
}
