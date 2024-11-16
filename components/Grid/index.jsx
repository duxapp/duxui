import { px } from '@/duxapp'
import React, { useMemo } from 'react'
import classNames from 'classnames'
import { View } from '../common'
import './index.scss'

export const Grid = ({
  column = 4,
  square,
  gap = 0,
  rowGap = gap,
  columnGap = gap,
  children,
  className,
  style,
  itemStyle,
  __hmStyle,
  ...props
}) => {

  const group = useMemo(() => {
    const _group = []
    const _childs = []
    const no = [false, true, null, undefined]
    React.Children.forEach(children, child => {
      if (!no.includes(child)) {
        _childs.push(child)
      }
    })
    _childs.forEach((child, index) => {
      const _index = index / column | 0
      if (!_group[_index]) {
        _group[_index] = []
      }
      _group[_index].push(child)
    })
    // 将最后一行填满
    const last = _group[_group.length - 1]
    if (last) {
      last.push(...new Array(column - last.length).fill(<View />))
    }
    return _group
  }, [children, column])

  return <View className={classNames('items-center', className)} style={{ ...style, rowGap: px(rowGap) }} {...props}>
    {
      group.map((item, index) => {
        return <View className='Grid__row self-stretch' key={index} style={{ columnGap: px(columnGap) }}>
          {
            item.map((child, childIndex) => <View
              key={childIndex}
              style={itemStyle}
              className={classNames('Grid__item flex-grow self-stretch', square && 'Grid__square')}
            >
              {
                square && React.isValidElement(child)
                  ? React.cloneElement(child, {
                    style: {
                      ...child.props.style,
                      height: '100%',
                      width: '100%'
                    },
                  })
                  : React.isValidElement(child)
                    ? React.cloneElement(child, {
                      style: {
                        ...child.props.style,
                        width: '100%'
                      },
                    })
                    : child
              }
            </View>)
          }
        </View>
      })
    }
  </View>
}
