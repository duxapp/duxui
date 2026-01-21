
import { nextTick, noop, ScrollView } from '@/duxapp'
import { View } from '@tarojs/components'
import { createSelectorQuery } from '@tarojs/taro'
import { useEffect, useMemo } from 'react'

let _id = 0

export const BaseScrollView = ({
  url,
  list,
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
  listStyle,
  listClassName,
  renderLine,
  keyField,
  props
}) => {

  const refs = useMemo(() => {
    return {
      id: 'duxui-list-scroll-' + (_id++),
      action,
      autoEnd: false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  refs.action = action

  // 当内容不满一屏时，自动加载后面的内容
  useEffect(() => {
    if (!list.length || refs.action.loadEnd || refs.autoEnd) {
      return
    }
    nextTick(() => {
      const query = createSelectorQuery()
      query.select('#' + refs.id).fields({ size: true })
      query.select('#' + refs.id + ' .list-content-wrapper').fields({ size: true })
      query.exec(([scroll, content]) => {
        if (!scroll?.height || !content?.height) {
          return
        }
        if (content.height - 10 < scroll.height) {
          refs.action.next().catch(noop)
        } else {
          refs.autoEnd = true
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length])

  return <ScrollView
    refresh={refresh}
    lowerThreshold={200}
    id={refs.id}
    {...props}
    refresherEnabled={!!url}
    onScrollToLower={() => {
      if (!page || !url) return
      action.next().catch(noop)
    }}
    onRefresh={() => {
      onRefresh?.()
      refs.autoEnd = false
    }}
  >
    <View className='list-content-wrapper'>
      {renderHeader}
      <View style={listStyle} className={listClassName}>
        {
          emptyStatus ?
            (renderEmpty || <Empty title={emptyTitle} />) :
            list.map((item, index) => <>
              {!!index && renderLine}
              <RenderItem key={item[keyField] || index} item={item} index={index} />
            </>)
        }
      </View>
      {renderFooter}
      {loadMore}
    </View>
  </ScrollView>
}
