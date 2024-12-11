import classNames from 'classnames'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import { Form } from './Form'
import { Input } from './Input'
import './InputNumber.scss'

export const InputNumber = ({
  value,
  onChange,
  disabled,
  max,
  min,
  step = 1,
  input,
  type = 'primary',
  defaultValue,
  className,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({ value, onChange, defaultValue })

  const stepPrecision = step.toString().includes('.') ? step.toString().split('.')[1].length : 0

  const click = increment => {
    if (disabled) return

    let newValue = val || 0
    newValue = increment === 1 ? newValue + step : newValue - step

    newValue = fixPrecision(newValue, stepPrecision)

    // 如果超出范围，进行修正
    if (typeof max !== 'undefined' && newValue > max) {
      newValue = max
    }
    if (typeof min !== 'undefined' && newValue < min) {
      newValue = min
    }

    // 更新值
    setVal(newValue)
  }

  const inputChange = inputValue => {

    let newValue = parseFloat(inputValue)

    // 如果输入为空，允许用户清空
    if (Number.isNaN(newValue)) {
      setVal('')
      return
    }

    // 修正为步进值的倍数
    const adjustedValue = fixPrecision(Math.round(newValue / step) * step, stepPrecision)

    // 限制范围
    if (typeof max !== 'undefined' && adjustedValue > max) {
      newValue = max
    } else if (typeof min !== 'undefined' && adjustedValue < min) {
      newValue = min
    } else {
      newValue = adjustedValue
    }

    setVal(newValue)
  }

  return <Row className={classNames(`r-1 border-w1 border-${type}`, className)} {...props}>
    <Column className={classNames(`InputNumber__btn bg-${type}`, (disabled || val <= min) && 'InputNumber__btn--disabled')} justify='center'
      onClick={() => click(0)}
    >
      <Text size={7} color={4}>-</Text>
    </Column>
    <Column grow className='InputNumber__value'>
      {
        input ?
          <Input align='center' value={val || 0} type='digit' disabled={disabled} onChange={inputChange} /> :
          <Text align='center'>{val || 0}</Text>
      }
    </Column>
    <Column className={classNames(`InputNumber__btn bg-${type}`, (disabled || val >= max) && 'InputNumber__btn--disabled')} justify='center'
      onClick={() => click(1)}
    >
      <Text size={7} color={4}>+</Text>
    </Column>
  </Row>
}

const fixPrecision = (value, precision = 2) => {
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}
