import { Textarea as TextareaTaro } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCallback } from 'react'
import classNames from 'classnames'
import { duxappTheme } from '@/duxapp'
import { Column } from '../Flex'
import { Text } from '../Text'
import './Textarea.scss'

export const Textarea = ({
  value,
  onChange,
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
  ...porps
}) => {

  const input = useCallback(e => onChange?.(e.detail.value), [onChange])

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
      value={value}
      maxlength={maxlength}
      className='Textarea__input'
      style={{ height: Taro.pxTransform(36 * line) }}
      placeholderTextColor={duxappTheme.textColor3}
      placeholderStyle={`color: ${duxappTheme.textColor3}`}
      onInput={input}
      {...porps}
    />
    {!!maxlength && showLength && <Text>{value?.length || 0}/{maxlength}</Text>}
  </Column>
}
