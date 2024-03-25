import { ComponentType, Component, CSSProperties } from 'react'

interface names {
  'roundcheckfill'
  'roundcheck'
  'backspace'
  'direction_left'
  'pengyouquan'
  'shoucangfill'
  'weixin'
  'xiaochengxu'
  'select'
  'direction_up-fill'
  'direction-down_fill'
  'up-down_fill'
  'more-horizontal'
  'add-select'
  'xuanzekuang'
  'xuanzhong'
  'close'
  'collection'
  'collection-fill'
  'direction_right'
}

interface DuxuiIconProps {
  /** 图标名称 */
  name?: keyof names
  /**
   * 图标颜色
   */
  color?: string
  /**
   * 图标尺寸
   */
  size?: number,
  /**
   * class
   */
  className: string,
  /**
   * 样式
   */
  style: CSSProperties,
  /**
   * 点击事件
   * @returns
   */
  onClick: () => void
}

/**
 * DuxuiIcon 图标库
 */
export class DuxuiIcon extends Component<DuxuiIconProps> {

}
