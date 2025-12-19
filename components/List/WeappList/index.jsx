
import { VirtualList } from '@tarojs/components-advanced/dist/components/virtual-list'
import { VirtualWaterfall } from '@tarojs/components-advanced/dist/components/virtual-waterfall'
import { useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { noop, Layout } from '@/duxapp'

export const WeappList = ({
  list,
  columns,
  renderHeader,
  renderFooter,
  emptyStatus,
  renderEmpty,
  loadMore,
  Empty,
  RenderItem,
  emptyTitle,
  page,
  action,
  refresh,
  onRefresh,
  virtualWaterfallProps,
  virtualListProps,
  props
}) => {

  const [height, setHeight] = useState(0)

  // 非RN端虚拟列表
  const isWaterfall = columns > 1

  const VList = isWaterfall ? VirtualWaterfall : VirtualList

  const [key, setKey] = useState(0)

  const oldLength = useRef(list.length)

  useMemo(() => {
    if (list.length < oldLength.current) {
      setKey(old => old + 1)
    }
    oldLength.current = list.length
  }, [list.length])

  return height > 0 ?
    <VList
      key={key}
      height={height}
      column={columns}
      className={props.className}
      style={props.style}
      itemData={list}
      itemCount={list.length}
      item={RenderItem}
      // 下拉刷新了上拉加载
      lowerThreshold={200}
      onScrollToLower={page && action.next || noop}
      refresherEnabled={!!onRefresh}
      refresherThreshold={50}
      onRefresherrefresh={() => {
        if (!refresh) {
          onRefresh?.()
        }
      }}
      refresherTriggered={!!refresh}
      refresherBackground='transparent'
      enhanced // 默认开启 防止抖动
      // 自定义渲染
      renderTop={<>
        {renderHeader}
        {emptyStatus && (renderEmpty || <Empty title={emptyTitle} />)}
      </>}
      renderBottom={<>
        {renderFooter}
        {loadMore}
      </>}
      {...(isWaterfall ? virtualWaterfallProps : virtualListProps)}
    /> :
    <Layout
      className={classNames('flex-grow', props.className)}
      style={props.style}
      onLayout={e => setHeight(e.height)}
    />
}
