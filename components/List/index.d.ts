import { ScrollViewProps } from '@tarojs/components'
import { Component, ReactElement, CSSProperties, FC } from 'react'
import { VirtualListProps } from '@tarojs/components-advanced/dist/components/virtual-list'
import { VirtualWaterfallProps } from '@tarojs/components-advanced/dist/components/virtual-waterfall'
import { Request } from '@/duxapp/utils/net'
import { RequestHooks } from '@/duxapp/utils/hooks/request'

interface ListProps extends ScrollViewProps {
  /** 请求url 和 request的url相同 如果url为空下拉刷新 上拉加载功能将停用 */
  url?: string
  /** 如果是外部控制列表数据，直接传入这个字段，并且url留空 */
  listData?: any[]
  /** 每一项的渲染组件 */
  renderItem: Component
  /** 请求参数 request 的data */
  data?: {
    [key: string]: any
  }
  /** 其他的请求参数 */
  requestOption?: Request.RequestOption
  /** 是否有分页，没有分页的接口可以设置false，默认true */
  page?: boolean
  /** 是否开启缓存 */
  cache?: boolean
  /**
   * 接口返回的列表字段 默认list
   * 如果指定的字段不存在，会判断上一级是不是数组，如果是就使用上一级作为列表
   */
  listField?: string
  /** 列表项的key 默认id */
  keyField?: string
  /** 请求回调函数 可以从这里获请求中的数据 需要返列表数据 */
  listCallback?: (list: any[], result: any) => any[]
  /** 是否在页面显示出来的时候刷新数据 */
  reloadForShow?: boolean | {
    // 传入一个展示的钩子
    useShow: () => void
  }
  /**
   * 控制列表刷新的行为（用于 `reloadForShow` 和下拉刷新）
   *
   * - `first`: 刷新到第一页（默认）
   * - `top`: 仅当滚动接近顶部时才刷新（scrollTop < 100）
   */
  reloadType?: 'first' | 'top'
  /** 传给 usePageData 的第二个参数 */
  option: RequestHooks.PageDataConfig
  /**
   * 列数 默认1
   * 这是对RN端的配置，其他端需要使用 listStyle 或者 listClassName去实现
   */
  columns?: number
  /** 插入头部的内容 */
  renderHeader?: ReactElement
  /** 插入底部的内容 */
  renderFooter?: ReactElement
  /** 每一项的分割线 */
  renderLine?: ReactElement
  /** 列表为空时显示的内容 这里存在一个默认值 */
  renderEmpty?: ReactElement
  /** 未指定renderEmpty时 的空标题 */
  emptyTitle?: string
  /**
   * usePageData 的action回调
   * 获取这个回调之后你可以用来手动刷新数据
   * 可以直接将一个ref值赋值给这个属性
   */
  onAction?: (action: RequestHooks.PageDataResult) => void
  /** 除了RN端，其他端应用于列表上的样式，可以用于实现多列布局 */
  listStyle?: CSSProperties
  /** 除了RN端，其他端应用于列表上的样式，可以用于实现多列布局 */
  listClassName?: string
  /**
   * 是否使用虚拟列表 这在小程序和H5端生效 RN端默认使用虚拟列表
   * 开启后还需要传入 virtualListProps 或者 virtualWaterfallProps 参数
   *
   * 如果columns>1使用virtualListProps传入参数
   *
   * 要需要配置 itemSize 才能正常显示，请查看相关文档
   *
   * 开启后，传入renderItem的组件就会接收到一个叫id的props，需要将这个id传递给你的组件的根节点
   *
   * https://nervjs.github.io/taro-docs/docs/virtual-list
   * https://nervjs.github.io/taro-docs/docs/virtual-waterfall
   */
  useVirtualList?: boolean
  /**
   * 传给虚拟列表的参数
   * https://nervjs.github.io/taro-docs/docs/virtual-list
   */
  virtualListProps?: VirtualListProps
  /**
   * 当 columns > 1 时传递给 virtual-waterfall 的参数
   * https://nervjs.github.io/taro-docs/docs/virtual-waterfall
   */
  virtualWaterfallProps?: VirtualWaterfallProps
  /**
   * 要传递给项目的属性，不支持动态更新
   */
  itemProps?: {
    [key: string]: any
  }
}

export function createList(
  usePageList: (
    url: Request.RequestOption,
    option?: RequestHooks.PageDataConfig
  ) => [any[], RequestHooks.PageDataResult]
): FC<ListProps> & {
  /**
   * 使用 useVirtualList 开启虚拟列表后可以要传入itemSize参数，使用这个函数转换
   */
  itemSize: (px: number) => number
}
