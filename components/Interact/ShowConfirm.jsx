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
      <View className='DuxuiShowConfirm__main'>
        <Text size={6} bold align='center'>{title}</Text>
        {content && <>{isValidElement(content) ? content : <Text className='DuxuiShowConfirm__content' color={2} size={3} align='center'>{content}</Text>}</>}
        <Divider padding={0} className='DuxuiShowConfirm__divider' />
        <Row className='DuxuiShowConfirm__btns'>
          {cancel && <>
            <Column grow items='center' justify='center' onClick={onCancel}>
              <Text size={6} align='center'>{cancelText}</Text>
            </Column>
            <Divider direction='vertical' />
          </>}
          <Column grow items='center' justify='center' onClick={onConfirm}>
            <Text type='primary' size={6} align='center'>{confirmText}</Text>
          </Column>
        </Row>
      </View>
    </View>
  )
}
