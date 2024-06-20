import { Textarea as TextareaTaro } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { duxappTheme } from '@/duxapp'
import { Column } from '../Flex'
import { Text } from '../Text'
import { Form } from './Form'
import './Textarea.scss'

export const Textarea = ({
  className,
  style,
  line = 5,
  grow,
  shrink,
  self,
  align,
  maxlength,
  showLength = true,
  _designKey,
  value,
  onChange,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({ value, onChange })

  return <Column
    style={style}
    className={classNames(
      'Textarea',
      grow && 'flex-grow',
      shrink && 'flex-shrink',
      self && 'self-' + self,
      align && 'text-' + align,
      className
    )}
    _designKey={_designKey}
  >
    <TextareaTaro
      maxlength={maxlength}
      className='Textarea__input'
      style={{ height: Taro.pxTransform(36 * line) }}
      placeholderTextColor={duxappTheme.textColor3}
      placeholderStyle={`color: ${duxappTheme.textColor3}`}
      onInput={setVal}
      value={val}
      {...props}
    />
    {!!maxlength && showLength && <Text>{val?.length || 0}/{maxlength}</Text>}
  </Column>
}
