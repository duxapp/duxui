import { useMemo, useState } from 'react'
import { duxuiLang } from '@/duxui/utils'
import { DatePicker, SelectorPicker, MultiSelectorPicker } from '../Picker'
import { ModalForm } from './Modal'
import { Column } from '../Flex'
import { InputSearch } from './Input'
import { Empty } from '../Empty'

export const PickerSelect = ({
  search,
  placeholder, grow,
  value, onChange, defaultValue,
  children, title, showButton, disabled, childPropsValueKey,
  _designKey,
  modalFormProps,
  ...props
}) => {

  return <ModalForm
    title={title}
    showButton={showButton}
    renderForm={search ?
      <SelectRenderForm {...props} /> :
      <SelectorPicker {...props} />
    }
    placeholder={placeholder}
    grow={grow}
    value={value}
    onChange={onChange}
    disabled={disabled}
    childPropsValueKey={childPropsValueKey}
    defaultValue={defaultValue}
    {...modalFormProps}
    _designKey={_designKey}
  >{children}</ModalForm>
}

const SelectRenderForm = /*@__PURE__*/ Object.assign(props => {

  const [keyword, setKeyword] = useState('')
  const t = duxuiLang.useT()

  const rangeList = useMemo(() => {
    if (!keyword) {
      return props.range
    }
    const isObject = typeof props.range?.[0] === 'object'
    return props.range?.filter(item => ('' + (isObject ? item[props.nameKey || 'name'] : item))?.includes(keyword))
  }, [keyword, props.nameKey, props.range])

  return <Column className='gap-3'>
    <Column className='bg-page r-2 p-2 mh-3 items-start'>
      <InputSearch value={keyword} placeholder={t('picker.searchPlaceholder')} onChange={setKeyword} className='w-full' />
    </Column>
    {
      !rangeList?.length ?
        <Empty title={t('empty.noOptions')} /> :
        <SelectorPicker {...props} range={rangeList} />
    }
  </Column>
}, { getShowText: SelectorPicker.getShowText })

export const PickerMultiSelect = ({
  placeholder, grow, value = [], onChange, defaultValue,
  children, title, showButton, disabled, childPropsValueKey,
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
    defaultValue={defaultValue}
    {...modalFormProps}
    _designKey={_designKey}
  >{children}</ModalForm>
}

export const PickerDate = ({
  placeholder, grow, value, onChange, defaultValue,
  children, title, showButton, disabled, childPropsValueKey,
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
    defaultValue={defaultValue}
    _designKey={_designKey}
    {...modalFormProps}
  >{children}</ModalForm>
}
