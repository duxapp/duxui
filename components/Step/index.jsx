import { useMemo } from 'react'
import { View } from '@tarojs/components'
import { px, ScrollView } from '@/duxapp'
import './index.scss'

const Row = ({
  item,
  index,
  startSize,
  first,
  last,
  renderStart,
  renderEnd,
  renderPoint,
  className,
  style,
  lineType,
  onClick
}) => {
  const lineStyle = useMemo(() => {
    const _style = {
      borderTopStyle: lineType
    }
    if (first && last) {

    } else if (first) {
      _style.width = '50%'
      _style.right = 0
    } else if (last) {
      _style.left = 0
      _style.width = '50%'
    } else {
      _style.left = 0
      _style.width = '100%'
    }
    return _style
  }, [first, last, lineType])

  const rootProps = useMemo(() => {
    if (onClick) {
      return {
        onClick: () => onClick({ item, index })
      }
    }
    return {}
  }, [index, item, onClick])

  return <View {...rootProps} className={`step-comp__item--row ${className || ''}`} style={style}>
    {!!startSize && <View className='step-comp__item__start items-center' style={{ height: px(startSize) }}>
      {renderStart?.({ item, index })}
    </View>}
    <View className='step-comp__item__center--row self-stretch'>
      <View className='step-comp__item__line--row items-center z-0' style={lineStyle} />
      <View className='step-comp__item__point items-center z-1'>
        {
          renderPoint
            ? renderPoint(item, index)
            : <View className='step-comp__item__point__point items-center' style={item?.pointColor ? { backgroundColor: item.pointColor } : {}} />
        }
      </View>
    </View>
    <View className='step-comp__item__end items-center'>{renderEnd?.({ item, index })}</View>
  </View>
}

const Column = ({
  item,
  index,
  pointTop,
  startSize,
  first,
  last,
  renderStart,
  renderEnd,
  renderPoint,
  className,
  style,
  lineType,
  onClick
}) => {

  const lineStyle = useMemo(() => {
    const top = px(pointTop + 10)
    const _style = {
      borderStyle: lineType
    }
    if (first && last) {

    } else if (first) {
      _style.top = top
      _style.height = '100%'
    } else if (last) {
      _style.top = 0
      _style.height = top
    } else {
      _style.top = 0
      _style.height = '100%'
    }
    return _style
  }, [first, last, lineType, pointTop])

  const rootProps = useMemo(() => {
    if (onClick) {
      return {
        onClick: () => onClick({ item, index })
      }
    }
    return {}
  }, [index, item, onClick])

  return <View {...rootProps} className={`step-comp__item--column self-stretch ${className || ''}`} style={style}>
    {!!startSize && <View className='step-comp__item__start' style={{ width: px(startSize) }}>{renderStart?.({ item, index })}</View>}
    <View className='step-comp__item__center--column'>
      <View className='step-comp__item__line--column z-0 items-center' style={lineStyle} />
      <View className='step-comp__item__point z-1 items-center' style={{ marginTop: px(pointTop) }}>
        {
          renderPoint
            ? renderPoint(item, index)
            : <View className='step-comp__item__point__point items-center' style={item?.pointColor ? { backgroundColor: item.pointColor } : {}} />
        }
      </View>
    </View>
    <View className='step-comp__item__end--column'>{renderEnd?.({ item, index })}</View>
  </View>
}

const RowContainer = ({ row, children }) => {
  if (row) {
    return <ScrollView.Horizontal className='step-comp__row'>
      {children}
    </ScrollView.Horizontal>
  }
  return children
}

/**
 * 横向时点在中间 纵向是点在距离顶部pointTop距离处
 * @param {*} param0
 * @returns
 */
export function Step({
  // 列表数据
  data,
  // row 横向 column 纵向
  type = 'row',
  // 是否垂直布局
  vertical = type === 'column',
  // 横向时上面的渲染内容 纵向是左侧的渲染内容
  renderStart,
  // 指定尺寸 横向时为高度 纵向时为宽度 不指定则不会渲染开始块
  startSize,
  // 横向时下面的渲染内容 纵向是右侧的渲染内容
  renderEnd,
  // 渲染中间的点的内容 获取在data的每一项上传入pointColor会自动渲染颜色
  renderPoint,
  // 当为纵向是设置点距离顶部的距离
  pointTop = 24,
  // 线条类型
  lineType = 'solid',
  onItemClick,
  style,
  itemClassName,
  itemStyle,
  ...props
}) {

  const row = useMemo(() => !vertical, [vertical])

  const Item = row ? Row : Column

  return <RowContainer row={row}>
    <View style={{ ...style, flexDirection: row ? 'row' : 'column', alignItems: 'center' }} {...props}>
      {
        data?.map((item, index) => {
          return <Item
            key={index}
            index={index}
            item={item}
            first={index === 0}
            last={index === data.length - 1}
            renderStart={renderStart}
            startSize={startSize}
            renderEnd={renderEnd}
            renderPoint={renderPoint}
            pointTop={pointTop}
            className={itemClassName || ''}
            style={itemStyle}
            lineType={lineType}
            onClick={onItemClick}
          />
        })
      }
    </View>
  </RowContainer>
}
