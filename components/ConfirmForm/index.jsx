import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import { KeyboardDismiss, PullView, TopView } from '@/duxapp'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import { Divider } from '../Divider'
import { Form, FormSubmit } from '../Form/Form'
import './index.scss'

const ConfirmForm = ({
  defaultValue,
  title = '请输入',
  form: FormIns,
  multiple,
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

  const submit = async data => {
    if (verify) {
      let status = verify(multiple ? data : val)
      if (status instanceof Promise) {
        status = await status
      }
      if (status !== true) {
        return
      }
    }
    await pullView.current.close()
    onSubmit(multiple ? data : val)
  }

  const content = (<Column className='ConfirmForm__main'>
    <Text size={6} bold align='center'>{title}</Text>
    <Column className='ConfirmForm__input'>
      {
        multiple ?
          FormIns :
          isValidElement(FormIns) ?
            cloneElement(FormIns, {
              value: val,
              onChange: setVal
            })
            : typeof FormIns === 'function' ?
              <FormIns value={val} onChange={setVal} />
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
      {
        multiple ?
          <FormSubmit>
            <Row grow items='center' justify='center'>
              <Text type='primary' size={6}>确定</Text>
            </Row>
          </FormSubmit> :
          <Row grow items='center' justify='center' onClick={submit}>
            <Text type='primary' size={6}>确定</Text>
          </Row>
      }
    </Row>
  </Column>)

  return <PullView ref={pullView} side='center' mask>
    <KeyboardDismiss>
      {
        multiple ?
          <Form
            itemPadding={false}
            defaultValues={defaultValue}
            onSubmit={submit}
          >{content}</Form>
          : content
      }
    </KeyboardDismiss>
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
