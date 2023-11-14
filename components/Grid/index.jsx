import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import React, { useMemo } from 'react'
import classNames from 'classnames'
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
  ...props
}) => {

  const group = useMemo(() => {
    const _group = []
    React.Children.forEach(children, ((child, index) => {
      const _index = index / column | 0
      if (!_group[_index]) {
        _group[_index] = []
      }
      _group[_index].push(child)
    }))
    // 将最后一行填满
    const last = _group[_group.length - 1]
    if (last) {
      last.push(...new Array(column - last.length).fill(<View />))
    }
    return _group
  }, [children, column])

  return <View className={className} style={{ ...style, rowGap: Taro.pxTransform(rowGap) }} {...props}>
    {
      group.map((item, index) => {
        return <View className='Grid__row' key={index} style={{ columnGap: Taro.pxTransform(columnGap) }}>
          {
            item.map((child, childIndex) => <View
              key={childIndex}
              itemStyle={itemStyle}
              className={classNames('Grid__item flex-grow', square && 'Grid__square')}
            >
              {
                square && React.isValidElement(child)
                  ? React.cloneElement(child, {
                    style: {
                      ...child.props.style,
                      height: '100%',
                    },
                  }) : child
              }
            </View>)
          }
        </View>
      })
    }
  </View>
}
