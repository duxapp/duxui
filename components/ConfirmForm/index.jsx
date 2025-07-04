import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import { PullView, TopView } from '@/duxapp'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import { Divider } from '../Divider'
import './index.scss'

const ConfirmForm = ({
  defaultValue,
  title = '请输入',
  form: Form,
  verify,
  cancel = true,
  onSubmit,
  onCancel
}) => {

  useEffect(() => {
    return () => onCancel?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [val, setVal] = useState(defaultValue)

  const pullView = useRef()

  const submit = async () => {
    if (verify) {
      let status = verify(val)
      if (status instanceof Promise) {
        status = await status
      }
      if (status !== true) {
        return
      }
    }
    await pullView.current.close()
    onSubmit(val)
  }

  return <PullView ref={pullView} side='center' mask>
    <Column className='ConfirmForm__main'>
      <Text size={6} bold align='center'>{title}</Text>
      <Column className='ConfirmForm__input'>
        {
          isValidElement(Form) ?
            cloneElement(Form, {
              value: val,
              onChange: setVal
            })
            : typeof Form === 'function' ?
              <Form value={val} onChange={setVal} />
              : console.error('confirmForm: 传入的form不是一个有效的元素')
        }
      </Column>
      <Divider className='ConfirmForm__divider' />
      <Row className='ConfirmForm__btns'>
        {cancel && <Row grow items='center' justify='center'
          onClick={async () => {
            await pullView.current.close()
            onCancel()
          }}
        >
          <Text size={6}>取消</Text>
        </Row>}
        <Divider direction='vertical' />
        <Row grow items='center' justify='center' onClick={submit}>
          <Text type='primary' size={6}>确定</Text>
        </Row>
      </Row>
    </Column>
  </PullView>
}

export const confirmForm = props => {
  return new Promise((resolve, reject) => {
    const action = TopView.add([ConfirmForm, {
      ...props,
      onSubmit: val => {
        action.remove()
        resolve(val)
      },
      onCancel: () => {
        action.remove()
        reject('取消输入')
      }
    }])
  })
}
