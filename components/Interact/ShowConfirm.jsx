import { View } from '@tarojs/components'
import { useEffect, isValidElement } from 'react'
import { PullView, TopView } from '@/duxapp'
import { Divider } from '../Divider'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import './ShowConfirm.scss'

const ShowConfirm = ({
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
    <PullView mask side='center' duration={120}>
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
    </PullView>
  )
}


/**
 * 在页面上显示一个提示框
 * @returns
 */
export const confirm = ({
  title = '提示',
  content,
  cancel,
  cancelText,
  confirmText,
  renderTop,
  renderBottom
} = {}) => {
  let action
  let callback = []
  const promise = new Promise((resolve, reject) => {
    callback = [resolve, reject]
    action = TopView.add([
      ShowConfirm,
      {
        title,
        content,
        cancel,
        cancelText,
        confirmText,
        renderTop,
        renderBottom,
        onCancel: () => {
          setTimeout(() => {
            resolve(false)
          }, 10)
          action.remove()
        },
        onConfirm: () => {
          setTimeout(() => {
            resolve(true)
          }, 10)
          action.remove()
        },
        onClose: () => {
          setTimeout(() => {
            reject('confirm:组件被卸载')
          }, 10)
          action.remove()
        }
      }
    ])
  })

  promise.confirm = () => {
    callback[0](true)
    action.remove()
  }
  promise.cancel = () => {
    callback[0](false)
    action.remove()
  }
  promise.close = () => {
    callback[1]()
    action.remove('confirm:主动关闭')
  }
  return promise
}

