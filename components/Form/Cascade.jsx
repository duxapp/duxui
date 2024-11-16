import { View } from '@tarojs/components'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, duxappTheme, recursionGetValue } from '@/duxapp'
import classNames from 'classnames'
import { Divider } from '../Divider'
import { DuxuiIcon } from '../DuxuiIcon'
import { Column } from '../Flex'
import { Text } from '../Text'
import { Space } from '../Space'
import './Cascade.scss'
import { Form } from './Form'

const findPosition = (cascadeData, value, valueKey = 'value', childrenKey = 'children', path = []) => {
  for (let i = 0; i < cascadeData.length; i++) {
    const item = cascadeData[i];
    if (item[valueKey] === value) {
      return [...path, i]
    } else if (item[childrenKey]) {
      const result = findPosition(item[childrenKey], value, valueKey, childrenKey, [...path, i])
      if (result) {
        return result
      }
    }
  }
  return null
}

export const Cascade = ({
  data,
  /**
   * 当没有一次性返回全部数据时，加载子分类数据的回调函数
   */
  getData,
  value,
  defaultValue,
  onChange,
  // 会把选中项的对象，而不是值传回去
  onChangeItem,
  disabled,
  mode = 'radio',
  // 是否多选
  checkbox = mode === 'checkbox',
  /**
   * 允许选中任何一级
   * 如果是多选模式当选到最后一级时才多选
   * 如果多选时就不会显示选中统计
   * 如果是多选时就不支持跨分类选择
   */
  anyLevel,
  /**
   * default 默认样式
   * fill 填充样式
   */
  theme = 'default',
  // 显示层级
  level = 1,
  childrenKey = 'children',
  nameKey = 'name',
  valueKey = 'value',
  className,
  style,
  ...props
}) => {

  const [val, setVal] = Form.useFormItemProxy({
    onChange,
    value,
    defaultValue
  })

  const isRadio = !checkbox

  const [list, setList] = useState(data || [])

  // 计算出默认选中值
  const defaultSelect = useMemo(() => {
    const _select = new Array(level - 1).fill(-1)
    if ((isRadio && typeof val !== 'undefined') || (!isRadio && typeof val?.[0] !== 'undefined')) {
      // console.log(findPosition(list, isRadio ? value : value[0]))
      findPosition(list, isRadio ? val : val[0])?.forEach((v, i) => {
        if (i < _select.length) {
          _select[i] = v
        }
      })
    }
    return _select
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [select, setSelect] = useState(defaultSelect)

  useEffect(() => {
    if (!list?.length) {
      getData?.({}, -1)?.then(res => {
        if (res.length) {
          setList(res)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list?.length])

  useEffect(() => {
    if (data?.length) {
      setList(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, level])

  const selectList = useMemo(() => {
    return select.reduce((prev, _select, index) => {
      const indexs = select.slice(0, index + 1)
      if (indexs[indexs.length - 1] === -1) {
        prev.push([])
      } else {
        const _val = recursionGetValue(indexs, list, childrenKey)?.[childrenKey] || []
        prev.push(_val)
      }
      return prev
    }, [list])
  }, [childrenKey, list, select])

  /**
   * 计算选中的值对应的每一项数据
   */
  const onChangeItemRef = useRef(onChangeItem)
  onChangeItemRef.current = onChangeItem
  useEffect(() => {
    if (!onChangeItemRef.current) {
      return
    }
    const valueItems = []
    const getChild = (_list, _level = level - 1) => {
      _list.some(item => {
        if (!_level) {
          const isSelect = isRadio ? val === item[valueKey] : val?.includes(item[valueKey])
          if (isSelect) {
            valueItems.push(item)
            // 找到所有的值 不再循环
            if (isRadio || valueItems.length === val.length) {
              return true
            }
          }
        } else {
          return getChild(item[childrenKey], _level - 1)
        }
      })
    }
    getChild(list)
    if (valueItems.length) {
      onChangeItemRef.current(isRadio ? valueItems[0] : valueItems)
    }
  }, [isRadio, list, level, valueKey, childrenKey, val])

  /**
   * 分类点击
   */
  const labelClick = useCallback(async (_level, index, item) => {
    if (disabled) return
    // 没有数据需要获取数据
    select[_level] = index
    setSelect([...select])
    if (getData) {
      const current = recursionGetValue(select.slice(0, _level + 1), list, childrenKey)
      if (!current[childrenKey]?.length) {
        current[childrenKey] = await getData(current, _level)
      }
    }
    setList([...list])
    if (anyLevel) {
      // 允许选择任何一级触发值更新
      if (isRadio) {
        setVal(item[valueKey])
      } else {
        setVal([item[valueKey]])
      }
    }
  }, [anyLevel, childrenKey, disabled, getData, isRadio, list, setVal, select, valueKey])

  /**
   * 最后一级点击
   */
  const rightClick = useCallback(item => {
    if (disabled) return
    if (isRadio) {
      if (val === item[valueKey]) {
        return
      }
      setVal(item[valueKey])
    } else {
      let _value = val instanceof Array ? [...val] : []
      if (anyLevel) {
        // 如果之前有值判断这些值是不是当前这个层级的值不是的剔除
        const keys = selectList[selectList.length - 1].map(v => v[valueKey])
        _value = _value.filter(v => keys.includes(v))
      }
      const _index = _value?.indexOf?.(item[valueKey]) ?? -1
      if (~_index) {
        _value.splice(_index, 1)
      } else {
        _value.push(item[valueKey])
      }
      if (_value.length === 0 && selectList.length > 1 && anyLevel) {
        // 取消选中所有子集后，选中上一级的id
        const prev = selectList[select.length - 1][select[select.length - 1]]
        _value.push(prev[valueKey])
      }
      setVal(_value)
    }
  }, [anyLevel, disabled, isRadio, setVal, select, selectList, val, valueKey])

  /**
   * 子元素点击
   */
  const itemClick = useCallback((_level, index, item) => {
    if (disabled) return
    if (_level + 1 === level) {
      rightClick(item)
    } else {
      labelClick(_level, index, item)
    }
  }, [disabled, labelClick, level, rightClick])

  /**
   * 子元素索引
   * 用于统计在某一项的子元素选择的数量
   */
  const listIndex = useMemo(() => {
    if (isRadio || level < 2) {
      return []
    }
    const getChild = (_list, _level = level - 1) => {
      const res = _list.map(item => {
        if (!_level) {
          return item[valueKey]
        } else {
          return getChild(item[childrenKey], _level - 1)
        }
      })
      if (!_level) {
        return res.flat()
      }
      return res
    }
    return getChild(list)
  }, [isRadio, level, list, valueKey, childrenKey])

  /**
   * 统计子元素选中项
   */
  const checkNumbers = useMemo(() => {
    if (isRadio || level < 2) {
      return []
    }
    return (val || [])?.reduce((prev, current) => {
      const index = listIndex.findIndex(v => v.includes(current))
      if (~index) {
        prev[index]++
      }
      return prev
    }, listIndex.map(() => 0))
  }, [isRadio, level, listIndex, val])

  const Render = theme === 'fill' ? FillRender : DefaultRender

  return <View className={classNames('Cascade', className)} style={style} {...props}>
    <Render
      list={selectList}
      select={select}
      isRadio={isRadio}
      checkNumbers={checkNumbers}
      labelClick={labelClick}
      nameKey={nameKey}
      value={val}
      valueKey={valueKey}
      rightClick={rightClick}
      itemClick={itemClick}
      anyLevel={anyLevel}
    />
  </View>
}


/**
 * 用于计算出选中的内容显示值
 * @param {*} value 当前值
 * @param {*} param1 传入组件的参数
 * @returns
 */
Cascade.getShowText = (value, {
  data = [],
  childrenKey = 'children',
  nameKey = 'name',
  valueKey = 'value',
} = {}) => {
  if (!Array.isArray(value)) {
    value = [value]
  }
  const getValue = (list = data, select = []) => {
    list.forEach(item => {
      if (value.includes(item[valueKey])) {
        select.push(item[nameKey])
      }
      if (item[childrenKey]?.length) {
        getValue(item[childrenKey], select)
      }
    })
    return select
  }
  return getValue()
}

const DefaultRender = ({
  list,
  select,
  isRadio,
  checkNumbers,
  labelClick,
  nameKey,
  value,
  valueKey,
  rightClick,
  anyLevel
}) => {

  const [lefts, right] = useMemo(() => [list.slice(0, list.length - 1), list[list.length - 1]], [list])

  return <>
    {
      lefts.map((group, groupIndex) => <View className='Cascade__left' key={groupIndex}>
        <ScrollView>
          {
            group.map((item, index) => {
              const isSelect = select[groupIndex] === index
              return <View key={index} className='Cascade__left__label self-stretch gap-2' onClick={() => labelClick(groupIndex, index, item)}>
                <Text style={{ color: isSelect ? duxappTheme.primaryColor : duxappTheme.textColor1 }} className='Cascade__left__label__title'>{item[nameKey]}</Text>
                {!isRadio && groupIndex === 0 && checkNumbers[index] > 0 && !anyLevel &&
                  <Text className='text-s1 text-primary'>已选 {checkNumbers[index]}</Text>
                }
              </View>
            })
          }
        </ScrollView>
      </View>)
    }
    <View className='Cascade__right'>
      <ScrollView>
        {
          right.map((item, index) => {
            const isSelect = isRadio ? value === item[valueKey] : value?.includes?.(item[valueKey])
            return <Fragment key={'item' + index}>
              {!!index && <Divider className='self-stretch' />}
              <View className='Cascade__right__item self-stretch' onClick={() => rightClick(item)}>
                <Text style={{ color: isSelect ? duxappTheme.primaryColor : duxappTheme.textColor1 }} className='Cascade__right__item__label'>{item[nameKey]}</Text>
                <DuxuiIcon
                  className='Cascade__right__item__icon'
                  color={isSelect ? duxappTheme.primaryColor : duxappTheme.textColor1}
                  name={
                    !isRadio ? (
                      isSelect ? 'xuanzhong' : 'xuanzekuang'
                    ) : (
                      isSelect ? 'add_check1' : 'option'
                    )
                  }
                />
              </View>
            </Fragment>
          })
        }
      </ScrollView>
    </View>
  </>
}

const FillRender = ({
  list,
  select,
  isRadio,
  checkNumbers,
  nameKey,
  value,
  valueKey,
  itemClick,
  anyLevel
}) => {

  return <Divider.Group vertical>
    {
      list.map((group, groupIndex) => {
        const last = groupIndex == list.length - 1
        return <Column key={groupIndex} grow>
          <ScrollView>
            {
              group.map((item, index) => {
                const isSelect = last ? isRadio ? value === item[valueKey] : value?.includes?.(item[valueKey]) : select[groupIndex] === index
                return <Space
                  row={last}
                  key={item[valueKey] || index}
                  items='center'
                  justify='center'
                  self='stretch'
                  onClick={() => itemClick(groupIndex, index, item)}
                  className={classNames('Cascade-fill__item', isSelect && 'Cascade-fill__item--select')}
                >
                  <Text {...isSelect ? { type: 'primary' } : {}} align='center'>
                    {item[nameKey]}
                  </Text>
                  {
                    !isRadio && groupIndex === 0 && !anyLevel && checkNumbers[index] > 0 &&
                    <Text {...isSelect ? { type: 'primary' } : {}} size={1}>已选{checkNumbers[index]}</Text>
                  }
                  {last && isSelect && <DuxuiIcon name='select' size={24} color={duxappTheme.primaryColor} />}
                </Space>
              })
            }
          </ScrollView>
        </Column>
      })
    }
  </Divider.Group>
}
