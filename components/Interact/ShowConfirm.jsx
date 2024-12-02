import { View } from '@tarojs/components'
import { useEffect, isValidElement } from 'react'
import { Divider } from '../Divider'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import './ShowConfirm.scss'

export const ShowConfirm = ({
  title,
  content,
  cancel = true,
  cancelText = '取消',
  confirmText = '确定',
  renderTop,
  renderBottom,
  onConfirm,
  onCancel,
  onClose
}) => {

  useEffect(() => {
    return () => onClose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className='DuxuiShowConfirm'>
      {renderTop}
      <View className='DuxuiShowConfirm__main'>
        {!!title && <Text size={6} bold align='center' className='mh-3'>{title}</Text>}
        {content && <>{isValidElement(content) ? content : <Text className='DuxuiShowConfirm__content' color={2} size={3} align='center'>{content}</Text>}</>}
        <Row className='DuxuiShowConfirm__btns'>
          {cancel && <>
            <Column grow items='center' justify='center' onClick={onCancel}>
              <Text size={6} className='w-full' align='center'>{cancelText}</Text>
            </Column>
            <Divider vertical />
          </>}
          <Column grow items='center' justify='center' onClick={onConfirm}>
            <Text type='primary' className='w-full' size={6} align='center'>{confirmText}</Text>
          </Column>
        </Row>
      </View>
      {renderBottom}
    </View>
  )
}
