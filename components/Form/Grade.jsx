import classNames from 'classnames'
import { DuxuiIcon } from '../DuxuiIcon'
import { Text } from '../Text'
import { Space } from '../Space'
import { Row } from '../Flex'
import './Grade.scss'

const arr = [...new Array(5)]

export const Grade = ({
  value,
  onChange,
  size = 'm',
  type = 'primary',
  ...props
}) => {

  const values = value ? ('' + value).split('.') : []

  return <Space row items='center' size={16} {...props}>
    <Row items='center'>
      {arr.map((item, index) => {
        return <Text
          type={index < value ? type : void 0}
          color={index < value ? void 0 : 3}
          key={index}
          onClick={() => onChange?.(index + 1)}
          className={classNames('Grade--' + size)}
        >
          <DuxuiIcon
            name={index < value ? 'collection-fill' : 'collection'} onClick={() => {
              // RN安卓端外面的事件不触发 触发了此处
              onChange?.(index + 1)
            }}
          />
        </Text>
      })}
    </Row>
    {!!value && <Text type={type}>{values[0]}.{values[1] || 0}</Text>}
  </Space>
}
