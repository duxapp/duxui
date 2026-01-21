import { View } from '@tarojs/components'
import { useEffect, isValidElement, useRef } from 'react'
import { PullView, TopView } from '@/duxapp'
import { duxuiLang } from '@/duxui/utils'
import { Divider } from '../Divider'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import './ShowConfirm.scss'

const ShowConfirm = ({
  title,
  content,
  cancel = true,
  cancelText,
  confirmText,
  renderTop,
  renderBottom,
  extraMenu,
  onConfirm,
  onCancel,
  onClose
}) => {

  const t = duxuiLang.useT()
  const titleText = title ?? t('interact.confirm.title')
  const cancelTextValue = cancelText ?? t('common.cancel')
  const confirmTextValue = confirmText ?? t('common.ok')

  useEffect(() => {
    return () => onClose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pullView = useRef()

  return (
    <PullView ref={pullView} mask side='center' duration={120}>
      {renderTop}
      <View className='DuxuiShowConfirm__main'>
        {!!titleText && <Text size={6} bold align='center' className='mh-3'>{titleText}</Text>}
        {content && <>{isValidElement(content) ? content : <Text className='DuxuiShowConfirm__content' color={2} size={3} align='center'>{content}</Text>}</>}
        <Row className='DuxuiShowConfirm__btns'>
          {cancel && <>
            <Column grow justify='center'
              onClick={async () => {
                await pullView.current.close()
                onCancel()
              }}
            >
              <Text size={6} align='center'>{cancelTextValue}</Text>
            </Column>
            <Divider vertical />
          </>}
          {
            extraMenu && <>
              <Column grow justify='center'
                onClick={async () => {
                  await pullView.current.close()
                  onClose()
                  extraMenu.callback?.()
                }}
              >
                <Text size={6} align='center' type={extraMenu.type}>{extraMenu.name}</Text>
              </Column>
              <Divider vertical />
            </>
          }
          <Column grow justify='center'
            onClick={async () => {
              await pullView.current.close()
              onConfirm()
            }}
          >
            <Text type='primary' size={6} align='center'>{confirmTextValue}</Text>
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
export const confirm = option => {
  let action
  let callback = []
  const promise = new Promise((resolve, reject) => {
    callback = [resolve, reject]
    action = TopView.add([
      ShowConfirm,
      {
        ...option,
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
            reject(duxuiLang.t('interact.confirm.unmounted'))
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
    action.remove(duxuiLang.t('interact.confirm.close'))
  }
  return promise
}
