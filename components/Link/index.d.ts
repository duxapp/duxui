import { StandardProps } from '@tarojs/components/types/common'

import { FC, ReactNode } from 'react'

interface LinkProps extends StandardProps {
  /**
   * 跳转连接
   */
  url: string
  /** 使用子元素的点击事件 */
  useChildren?: boolean
}

/**
 * 跳转连接 需要传入一个支持 onClick事件的子组件
 */
export const Link: FC<LinkProps>
