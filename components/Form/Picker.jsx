import { DatePicker, SelectorPicker, MultiSelectorPicker } from '../Picker'
import { ModalForm } from './Modal'

export const PickerSelect = ({
  placeholder, grow, value, onChange, children, title, showButton, disabled,
  ...props
}) => {

  return <ModalForm
    title={title}
    showButton={showButton}
    renderForm={<SelectorPicker {...props} />}
    placeholder={placeholder}
    grow={grow}
    value={value}
    onChange={onChange}
    disabled={disabled}
  />
}

export const PickerMultiSelect = ({
  placeholder, grow, value, onChange, children, title, showButton, disabled,
  ...props
}) => {

  return <ModalForm
    title={title}
    showButton={showButton}
    renderForm={<MultiSelectorPicker {...props} />}
    placeholder={placeholder}
    grow={grow}
    value={value}
    onChange={onChange}
    disabled={disabled}
  />
}

PickerMultiSelect.defaultProps = {
  value: [],
  range: []
}

export const PickerDate = ({
  placeholder, grow, value, onChange, children, title, showButton, disabled,
  ...props
}) => {
  return <ModalForm
    title={title}
    showButton={showButton}
    renderForm={<DatePicker {...props} />}
    placeholder={placeholder}
    grow={grow}
    value={value}
    onChange={onChange}
    disabled={disabled}
  >{children}</ModalForm>
}
