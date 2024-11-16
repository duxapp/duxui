import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import { Form } from './Form'
import './InputCode.scss'

export const InputCode = ({
  value = '', onChange, defaultValue,
  itemStyle, length = 6, password, focus,
  className, style,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({ value, onChange, defaultValue })

  const arr = useMemo(() => {
    const _value = '' + val
    return Array(length).fill(0).map((v, i) => {
      return _value[i] || ''
    })
  }, [length, val])

  return <Row
    className={classNames('InputCode', className)}
    style={style} justify='between' items='center'
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
          (password ?
            <Column className='w-full items-center justify-center'>
              <Column className='InputCode__password' />
            </Column> :
            <Text size={7} className='w-full text-center' align='center'>{value}</Text>
          )
          : <Column className='w-full' items='center' />
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

  return <Column className='w-full items-center'>
    {show && <Column className='InputCode__focus' />}
  </Column>
}
