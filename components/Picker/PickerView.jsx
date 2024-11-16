import { useCallback, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { PickerView as TaroPickerView, PickerViewColumn } from './view'
import './common.scss'
import { Text } from '../Text'

export const PickerView = ({
  value = [],
  grow,
  onChange,
  className,
  children,
  ...props
}) => {

  const valueRef = useRef(value)
  valueRef.current = value

  const range = useMemo(() => {
    return children?.map?.(column => {
      return column.props.children?.map((item, index) => item.props.value ?? index)
    }) || []
  }, [children])

  const change = useCallback(
    (e) => {
      const indexs = e.detail.value
      const items = range.map((v, i) => v[indexs[i]])
      let index
      if (!valueRef.current?.length) {
        index = indexs.findIndex(v => v)
      } else {
        index = valueRef.current.findIndex((v, i) => v !== items[i])
      }
      onChange(items, index)
    },
    [onChange, range]
  )

  const select = useMemo(() => {
    let indexs = range.map((item, index) => item.findIndex(v => v === value[index]))
    /**
     * 首次加载如果未选中，则给一个默认值，否则看着像是选中的，但是实际未选中
     */
    if (indexs.some(v => v === -1)) {
      indexs = indexs.map(v => {
        if (v === -1) {
          return 0
        }
        return v
      })
      change({ detail: { value: indexs } })
    }
    return indexs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, value])

  return <TaroPickerView onChange={change} value={select} {...props} className={classNames('PickerView', grow && 'flex-grow', className)}>
    {process.env.TARO_ENV === 'harmony' ? <Text align='center'>鸿蒙端暂不支持 Picker</Text> : children}
  </TaroPickerView>
}

export const PickerViewColumnItem = ({
  value,
  children
}) => {
  return children
}

export {
  PickerViewColumn
}
