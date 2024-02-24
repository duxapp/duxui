import { ReactNode, CSSProperties, HTMLAttributes } from 'react'
import { CommonEventFunction } from '@tarojs/components/types/common'
import { StandardProps } from '@tarojs/components/types/common'

interface LinearGradientProps extends StandardProps {
  /**
   * 起点坐标
   */
  start?: {
    /**
     * 起点x坐标，取值范围为[0, 1]
     */
    x: number
    /**
     * 起点y坐标，取值范围为[0, 1]
     */
    y: number
  }
  /**
   * 终点坐标
   */
  end?: {
    /**
     * 终点x坐标，取值范围为[0, 1]
     */
    x: number
    /**
     * 终点y坐标，取值范围为[0, 1]
     */
    y: number
  }
  /**
   * 渐变色列表
   */
  colors?: string[]
  /**
   * 渐变色在渐变中的位置，必须是一个有序数组，取值范围为[0, 1]
   */
  locations?: number[]
  /**
   * 是否使用角度控制渐变方向，默认值为false
   */
  useAngle?: boolean
  /**
   * 角度中心点
   */
  angleCenter?: {
    /**
     * 中心点x坐标，取值范围为[0, 1]
     */
    x: number
    /**
     * 中心点y坐标，取值范围为[0, 1]
     */
    y: number
  }
  /**
   * 渐变角度，顺时针方向，单位为度，默认值为0
   */
  angle?: number
  /**
   * 组件样式对象
   */
  style?: CSSProperties
  /**
   * 组件子元素
   */
  children?: ReactNode
  /**
   * 事件绑定函数，响应点击事件
   */
  onClick?: CommonEventFunction
}

export const LinearGradient: React.FC<LinearGradientProps>
