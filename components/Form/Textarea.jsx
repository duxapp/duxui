import { Textarea as TextareaTaro } from '@tarojs/components'
import classNames from 'classnames'
import { duxappTheme, px } from '@/duxapp'
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
  defaultValue,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({ value, onChange, defaultValue })

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
      style={{ height: px(36 * line) }}
      placeholderTextColor={duxappTheme.textColor3}
      placeholderStyle={`color: ${duxappTheme.textColor3}`}
      onInput={setVal}
      value={val}
      {...props}
    />
    {!!maxlength && showLength && <Text>{val?.length || 0}/{maxlength}</Text>}
  </Column>
}
