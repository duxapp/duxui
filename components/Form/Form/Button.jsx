import { isValidElement, cloneElement } from 'react'
import { Button } from '../../Button'
import { useFormContext } from './Form'

export const FormSubmit = ({ data, children, ...props }) => {
  const form = useFormContext()
  if (isValidElement(children)) {
    return cloneElement(children, {
      onClick: e => {
        children.props.onClick?.(e)
        form.submit(data)
      }
    })
  }
  return <Button {...props} onClick={() => form.submit(data)}>
    {children}
  </Button>
}

export const FormReset = ({ children, ...props }) => {
  const form = useFormContext()
  if (isValidElement(children)) {
    return cloneElement(children, {
      onClick: e => {
        children.props.onClick?.(e)
        form.reset()
      }
    })
  }
  return <Button {...props} onClick={form.reset}>
    {children}
  </Button>
}
