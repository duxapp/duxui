import { useMemo, useState } from 'react'
import { DatePicker, SelectorPicker, MultiSelectorPicker } from '../Picker'
import { ModalForm } from './Modal'
import { Column } from '../Flex'
import { Input } from './Input'
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

const SelectRenderForm = props => {

  const [keyword, setKeyword] = useState('')

  const rangeList = useMemo(() => {
    if (!keyword) {
      return props.range
    }
    const isObject = typeof props.range?.[0] === 'object'
    return props.range?.filter(item => ('' + (isObject ? item[props.nameKey || 'name'] : item))?.includes(keyword))
  }, [keyword, props.nameKey, props.range])

  return <Column className='gap-3 items-center'>
    <Column className='bg-page r-2 p-2 mh-3 self-stretch items-start'>
      <Input.Search value={keyword} placeholder='输入关键词搜索' onChange={setKeyword} className='w-full' />
    </Column>
    {
      !rangeList?.length ?
        <Empty title='没有可选数据' /> :
        <SelectorPicker {...props} className='self-stretch' range={rangeList} />
    }
  </Column>
}

SelectRenderForm.getShowText = SelectorPicker.getShowText

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
