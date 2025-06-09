import classNames from 'classnames'
import { DuxuiIcon } from '../DuxuiIcon'
import { Text } from '../Text'
import { Space } from '../Space'
import { Row } from '../Flex'
import { useFormItemProxy } from './Form'
import './Grade.scss'

const arr = [...new Array(5)]

export const Grade = ({
  value,
  onChange,
  defaultValue,
  size = 'm',
  type = 'primary',
  disabled,
  ...props
}) => {

  const [val, setVal] = useFormItemProxy({
    value,
    onChange,
    defaultValue
  })

  const values = val ? ('' + val).split('.') : []

  return <Space row items='center' size={16} {...props}>
    <Row items='center'>
      {arr.map((item, index) => {
        return <DuxuiIcon
          key={index}
          name={index < val ? 'collection-fill' : 'collection'}
          onClick={() => !disabled && setVal?.(index + 1)}
          className={classNames('Grade--' + size, index < val ? `text-${type}` : 'text-c3')}
        />
      })}
    </Row>
    {!!val && <Text type={type}>{values[0]}.{values[1] || 0}</Text>}
  </Space>
}
