import classNames from 'classnames'
import { DuxuiIcon } from '../DuxuiIcon'
import { Text } from '../Text'
import { Space } from '../Space'
import { Row } from '../Flex'
import { Form } from './Form'
import './Grade.scss'

const arr = [...new Array(5)]

export const Grade = ({
  value,
  onChange,
  defaultValue,
  size = 'm',
  type = 'primary',
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({
    value,
    onChange,
    defaultValue
  })

  const values = val ? ('' + val).split('.') : []

  return <Space row items='center' size={16} {...props}>
    <Row items='center'>
      {arr.map((item, index) => {
        return <Text
          type={index < val ? type : void 0}
          color={index < val ? void 0 : 3}
          key={index}
          onClick={() => setVal?.(index + 1)}
          className={classNames('Grade--' + size)}
        >
          <DuxuiIcon
            name={index < val ? 'collection-fill' : 'collection'} onClick={() => {
              // RN安卓端外面的事件不触发 触发了此处
              setVal?.(index + 1)
            }}
          />
        </Text>
      })}
    </Row>
    {!!val && <Text type={type}>{values[0]}.{values[1] || 0}</Text>}
  </Space>
}
