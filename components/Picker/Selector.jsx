import { useCallback, useMemo } from 'react'
import { pure } from '@/duxui/utils'
import { MultiSelectorPicker } from './MultiSelector'
import './common.scss'

export const SelectorPicker = /*@__PURE__*/ pure(() => {
  const SelectorPicker_ = ({
    range = [],
    value,
    onChange,
    ...props
  }) => {

    const change = useCallback(e => {
      onChange?.(e[0])
    }, [onChange])

    const _range = useMemo(() => [range], [range])
    const _value = useMemo(() => [value], [value])

    return <MultiSelectorPicker range={_range} onChange={change} value={_value} {...props} />
  }

  SelectorPicker_.getShowText = (value, {
    range = [],
    nameKey = 'name',
    valueKey = 'value',
  }) => {
    return MultiSelectorPicker.getShowText([value], {
      range: [range],
      nameKey,
      valueKey
    })
  }

  return SelectorPicker_
})
