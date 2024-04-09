import { View } from '@tarojs/components'
import { PickerView, PickerViewColumn, PickerViewColumnItem } from './PickerView'
import './common.scss'

export const MultiSelectorPicker = ({
  range,
  nameKey = 'name',
  valueKey = 'value',
  ...props
}) => {

  const isObject = typeof range?.[0]?.[0] === 'object'

  return <PickerView {...props}>
    {
      range.map((item, index) => <PickerViewColumn key={index}>
        {
          item.map(_item => {
            const text = isObject ? _item[nameKey] : _item
            const value = isObject ? _item[valueKey] : _item
            return <PickerViewColumnItem key={value} value={value}>
              <View className='PickerView__item'>{text}</View>
            </PickerViewColumnItem>
          })
        }
      </PickerViewColumn>)
    }
  </PickerView>
}

/**
 * 用于计算出选中的内容显示值
 * @param {*} value 当前值
 * @param {*} param1 传入组件的参数
 * @returns
 */
MultiSelectorPicker.getShowText = (value, {
  range = [],
  nameKey = 'name',
  valueKey = 'value',
} = {}) => {
  if (!value?.length) {
    return ''
  }
  const isObject = typeof range?.[0]?.[0] === 'object'

  return range.map((item, index) => {
    const _item = item.find(v => (isObject ? v[valueKey] : v) === value[index])
    if (_item) {
      return isObject ? _item[nameKey] : _item
    }
    return ''
  })
}

MultiSelectorPicker.defaultProps = {
  range: [],
  value: [],
}
