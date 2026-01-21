import { useEffect, useMemo, memo, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react'
import { useDidShow } from '@tarojs/taro'
import { noop, pxNum } from '@/duxapp'
import { duxuiLang } from '@/duxui/utils'
import { ListLoading } from './Loading'
import { ListSelect } from './Select'
import { FlatList } from './FlatList'
import { WeappList } from './WeappList'
import { Empty } from '../Empty'
import { BaseScrollView } from './ScrollView'
import './index.scss'

export const createList = usePageData => {
  const List = forwardRef(function List_({
    renderItem: Item,
    renderLine,
    listCallback,
    listField = 'list',
    keyField = 'id',
    reloadForShow,
    reloadType = 'first',
    listData,
    url,
    data,
    requestOption,
    option,
    renderHeader,
    renderFooter,
    columns = 1,
    // 是否分页 默认是有分页的 某些数据后台是一次性返回的，没有分页
    page = true,
    // 为空提示文字
    emptyTitle,
    // 自定义为空时候的提示渲染
    renderEmpty,
    // 数据操作的回调
    onAction,
    // 是否启用缓存
    cache,
    listStyle,
    listClassName,
    useVirtualList,
    virtualListProps,
    virtualWaterfallProps,
    // 传递列表项目的属性，不支持动态动态更新
    itemProps,
    ...props
  }, ref) {
    const t = duxuiLang.useT()
    const emptyTitleText = emptyTitle ?? t('empty.noData')

    const [_list, action] = usePageData({
      url, data, ...requestOption
    }, {
      field: listField,
      listCallback,
      cache,
      ...option,
      ready: (option?.ready ?? true) && !!url,
    })

    const list = listData || _list

    const scrollTopRef = useRef(0)
    const oldRefreshing = useRef(false)

    const { onRefresh: propsOnRefresh, onScroll: propsOnScroll, ...restProps } = props

    const refs = useRef({})
    refs.current = {
      ...itemProps,
      list,
      action,
      reloadType,
      ready: option?.ready,
      onScroll: propsOnScroll
    }

    const handleScroll = useCallback((e) => {
      const nextScrollTop = e?.detail?.scrollTop ?? e?.nativeEvent?.contentOffset?.y
      if (typeof nextScrollTop === 'number' && !Number.isNaN(nextScrollTop)) {
        scrollTopRef.current = nextScrollTop
      }
      refs.current.onScroll?.(e)
    }, [])

    useEffect(() => {
      if (action.refresh && !oldRefreshing.current) {
        scrollTopRef.current = 0
      }
      oldRefreshing.current = action.refresh
    }, [action.refresh])

    const runReload = useCallback(() => {
      const { action: currentAction, reloadType: currentReloadType, ready } = refs.current
      if (ready === false) {
        return
      }
      if (currentReloadType === 'top' && scrollTopRef.current >= 100 && refs.current.list?.length) {
        return
      }
      return currentAction.reload()
    }, [])

    useDidShow(() => {
      // 在上面页面关掉的时候刷新数据
      reloadForShow === true && runReload()
    })

    // 如果传入TabBar组件，则使用TabBar组件的显示hook加载数据
    reloadForShow?.useShow?.(() => {
      runReload()
    })

    useEffect(() => {
      if (typeof onAction === 'function') {
        onAction?.(action)
      } else if (onAction) {
        onAction.current = action
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action])

    useImperativeHandle(ref, () => {
      return action
    })

    const emptyStatus = !action.loading && !list.length

    const { type } = ListSelect.useContext()

    const RenderItem = useMemo(() => {
      const Item_ = ({ data: itemData, id, index, item = itemData?.[index], ...otherProps }) => {
        return <ListSelect.Item item={item} index={index} id={id}>
          <Item item={item} id={type ? undefined : id} index={index} {...otherProps} {...refs.current} />
        </ListSelect.Item>
      }
      if (process.env.TARO_ENV === 'rn') {
        return Item_
      }
      return memo(Item_)
    }, [type])

    const [pullRefreshing, setPullRefreshing] = useState(false)

    const actionLoading = action.loading
    const actionReload = action.reload

    useEffect(() => {
      if (!actionLoading && pullRefreshing) {
        setPullRefreshing(false)
      }
    }, [actionLoading, pullRefreshing])

    const handleUserRefresh = useCallback((...args) => {
      if (!url) {
        return
      }
      if (actionLoading) {
        propsOnRefresh?.(...args)
        return
      }
      if (reloadType === 'top' && scrollTopRef.current >= 100 && list.length) {
        propsOnRefresh?.(...args)
        return
      }
      setPullRefreshing(true)
      actionReload()
      propsOnRefresh?.(...args)
    }, [actionLoading, actionReload, list.length, propsOnRefresh, reloadType, url])

    const refresh = pullRefreshing

    const loadMore = (page && !!url && !action.refresh && list.length > 5 || (action.loadEnd && !emptyStatus)) && <ListLoading
      loading={action.loading}
      text={action.loading ? t('common.loading') : action.loadEnd ? t('common.noMore') : t('common.pullToLoad')}
    />

    return <ListSelect>
      {
        process.env.TARO_ENV === 'rn' ?
          <FlatList
            nestedScrollEnabled
            numColumns={columns}
            refresh={refresh}
            onScrollToLower={() => page && url && action.next().catch(noop)}
            onRefresh={!!url && handleUserRefresh}
            onScroll={handleScroll}
            keyExtractor={(item, index) => item[keyField] ?? index}
            data={list}
            renderItem={RenderItem}
            ItemSeparatorComponent={renderLine}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={!action.loading && (renderEmpty || <Empty title={emptyTitleText} />)}
            ListFooterComponent={<>
              {renderFooter}
              {loadMore}
            </>}
            {...restProps}
            maintainVisibleContentPosition={{
              disabled: true,
              ...restProps.maintainVisibleContentPosition
            }}
          /> : useVirtualList && process.env.TARO_ENV !== 'harmony_cpp' ?
            <WeappList
              url={url}
              list={list}
              RenderItem={RenderItem}
              columns={columns}
              page={page}
              renderHeader={renderHeader}
              renderFooter={renderFooter}
              emptyStatus={emptyStatus}
              renderEmpty={renderEmpty}
              loadMore={loadMore}
              Empty={Empty}
              emptyTitle={emptyTitleText}
              action={action}
              refresh={refresh}
              onRefresh={handleUserRefresh}
              props={{ ...restProps, onScroll: handleScroll }}
              virtualListProps={virtualListProps}
              virtualWaterfallProps={virtualWaterfallProps}
            /> :
            <BaseScrollView
              url={url}
              list={list}
              RenderItem={RenderItem}
              page={page}
              renderHeader={renderHeader}
              renderFooter={renderFooter}
              emptyStatus={emptyStatus}
              renderEmpty={renderEmpty}
              loadMore={loadMore}
              Empty={Empty}
              emptyTitle={emptyTitleText}
              action={action}
              refresh={refresh}
              onRefresh={handleUserRefresh}
              props={{ ...restProps, onScroll: handleScroll }}
              listStyle={listStyle}
              listClassName={listClassName}
              renderLine={renderLine}
              keyField={keyField}
            />
      }
      <ListSelect.Submit />
    </ListSelect>
  })

  List.itemSize = pxNum

  return List
}

export {
  ListLoading
}
