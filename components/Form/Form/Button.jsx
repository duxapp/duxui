import { isValidElement, cloneElement } from 'react'
import { Button } from '../../Button'
import { useFormContext } from './Form'

export const FormSubmit = ({ children, ...props }) => {
  const form = useFormContext()
  if (isValidElement(children)) {
    return cloneElement(children, {
      onClick: e => {
        children.props.onClick?.(e)
        form.submit()
      }
    })
  }
  return <Button {...props} onClick={form.submit}>
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
