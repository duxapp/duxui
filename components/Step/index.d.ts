import { Component, CSSProperties } from 'react'
import { ViewProps } from '@tarojs/components'

interface StepProps extends ViewProps {
  // 列表数据
  data: any[],
  // 是否垂直布局
  vertical?: boolean
  // 横向时上面的渲染内容 纵向是左侧的渲染内容
  renderStart?: Component
  // 指定尺寸 横向时为高度 纵向时为宽度 不指定则不会渲染开始块
  startSize?: number
  // 横向时下面的渲染内容 纵向是右侧的渲染内容
  renderEnd?: Component
  // 渲染中间的点的内容 或者在data的每一项上传入pointColor会自动渲染颜色
  renderPoint?: Component
  // 当为纵向是设置点距离顶部的距离
  pointTop?: number
  // 项目点击回调
  onItemClick?: (option: { item: any, index: number }) => void
  // 每一项的样式
  itemClassName?: string
  // 线条类型
  lineType?: 'solid' | 'dashed' | 'dotted'
  // 每一项的样式
  itemStyle?: CSSProperties
}

export const Step: React.FC<StepProps>
