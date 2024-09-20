import { DatePicker, SelectorPicker, MultiSelectorPicker } from '../Picker'
import { ModalForm } from './Modal'

export const PickerSelect = ({
  placeholder, grow, value, onChange, children, title, showButton, disabled, childPropsValueKey,
  _designKey,
  modalFormProps,
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
    childPropsValueKey={childPropsValueKey}
    {...modalFormProps}
    _designKey={_designKey}
  />
}

export const PickerMultiSelect = ({
  placeholder, grow, value = [], onChange, children, title, showButton, disabled, childPropsValueKey,
  _designKey,
  modalFormProps,
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
    childPropsValueKey={childPropsValueKey}
    {...modalFormProps}
    _designKey={_designKey}
  />
}

export const PickerDate = ({
  placeholder, grow, value, onChange, children, title, showButton, disabled, childPropsValueKey,
  _designKey,
  modalFormProps,
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
    childPropsValueKey={childPropsValueKey}
    _designKey={_designKey}
    {...modalFormProps}
  >{children}</ModalForm>
}
