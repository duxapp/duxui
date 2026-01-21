
import { VirtualList } from '@tarojs/components-advanced/dist/components/virtual-list'
import { VirtualWaterfall } from '@tarojs/components-advanced/dist/components/virtual-waterfall'
import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { nextTick, noop, Layout } from '@/duxapp'
import { View } from '@tarojs/components'
import { createSelectorQuery } from '@tarojs/taro'

let _id = 0

export const WeappList = ({
  url,
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

  const isWaterfall = columns > 1 || !!virtualWaterfallProps

  const VList = isWaterfall ? VirtualWaterfall : VirtualList

  const vlistRef = useRef(null)
  const refs = useRef({
    id: 'duxui-list-vlist-' + (_id++),
    autoEnd: false
  })
  const listId = props?.id || refs.current.id
  const actionRefresh = action?.refresh
  const actionLoading = action?.loading
  const actionLoadEnd = action?.loadEnd
  const actionNext = action?.next
  const oldLength = useRef(list.length)
  const oldList = useRef(list)
  const oldActionRefresh = useRef(!!action?.refresh)
  const oldColumns = useRef(columns)

  const hardRelayout = useCallback(() => {
    const instance = vlistRef.current
    instance?.preset?.resetCache?.()
    if (isWaterfall && instance?.itemMap) {
      if (typeof columns === 'number' && columns > 0) {
        instance.itemMap.columns = columns
      }
      instance.itemMap._items = []
      instance.itemMap._columnMap = new Array(columns).fill(0).map(() => [])
      instance.itemMap.refreshCounter++
    }
    instance?.refresh?.()
    instance?.forceUpdate?.()
  }, [columns, isWaterfall])

  useEffect(() => {
    if (!isWaterfall) {
      oldLength.current = list.length
      oldActionRefresh.current = !!action?.refresh
      return
    }

    const refreshEnded = oldActionRefresh.current && !action?.refresh
    const dataChanged = list !== oldList.current
    const lengthChanged = list.length !== oldLength.current
    const lengthDecreased = list.length < oldLength.current

    if (lengthDecreased) {
      hardRelayout()
    } else if (refreshEnded && (dataChanged || lengthChanged)) {
      // 瀑布流在小程序端会缓存 item 高度/布局；刷新或参数变更后需要重置布局映射，否则会沿用旧高度
      hardRelayout()
    }

    oldLength.current = list.length
    oldList.current = list
    oldActionRefresh.current = !!action?.refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action?.refresh, hardRelayout, isWaterfall, list, list.length])

  useEffect(() => {
    if (isWaterfall && oldColumns.current !== columns) {
      oldColumns.current = columns
      hardRelayout()
    }
  }, [columns, hardRelayout, isWaterfall])

  useEffect(() => {
    if (actionRefresh) {
      refs.current.autoEnd = false
    }
  }, [actionRefresh])

  // 当内容不满一屏时，自动加载后面的内容
  useEffect(() => {
    if (!page || !url || !list.length || actionLoadEnd || refs.current.autoEnd || actionRefresh || actionLoading) {
      return
    }

    const contentId = '#' + listId + (isWaterfall ? '-wrapper' : '-inner')

    nextTick(() => {
      const query = createSelectorQuery()
      query.select('#' + listId).fields({ size: true })
      query.select(contentId).fields({ size: true })
      query.select('#' + listId + '-duxui-top').fields({ size: true })
      query.select('#' + listId + '-duxui-bottom').fields({ size: true })
      query.exec(([scroll, content, top, bottom]) => {
        if (!scroll?.height || !content?.height) {
          return
        }
        const contentHeight = (top?.height || 0) + content.height + (bottom?.height || 0)
        if (contentHeight - 10 < scroll.height) {
          actionNext?.().catch?.(noop)
        } else {
          refs.current.autoEnd = true
        }
      })
    })
  }, [actionLoadEnd, actionLoading, actionNext, actionRefresh, isWaterfall, list.length, listId, page, url])

  return <Layout
    className={classNames('flex-grow', props.className)}
    style={props.style}
    onLayout={e => setHeight(e.height)}
  >
    {height > 0 && <VList
      {...props}
      ref={vlistRef}
      id={listId}
      height={height}
      column={columns}
      className={props.className}
      style={props.style}
      itemData={list}
      itemCount={list.length}
      item={RenderItem}
      // 下拉刷新了上拉加载
      lowerThreshold={200}
      onScrollToLower={() => page && url && actionNext?.().catch?.(noop)}
      refresherEnabled={!!onRefresh && !!url}
      refresherThreshold={50}
      refresherTriggered={!!refresh}
      refresherBackground='transparent'
      enhanced // 默认开启 防止抖动
      // 自定义渲染
      renderTop={<View id={listId + '-duxui-top'}>
        {renderHeader}
        {emptyStatus && (renderEmpty || <Empty title={emptyTitle} />)}
      </View>}
      renderBottom={<View id={listId + '-duxui-bottom'}>
        {renderFooter}
        {loadMore}
      </View>}
      {...(isWaterfall ? virtualWaterfallProps : virtualListProps)}
      onRefresherrefresh={() => {
        refs.current.autoEnd = false
        if (!refresh) {
          onRefresh?.()
        }
      }}
    />}
  </Layout>
}
