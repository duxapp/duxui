import { ReactElement } from 'react'
import { ColumnProps } from '../Flex'

interface ColorPickerProps extends ColumnProps {
  /**
   * 改变事件
   */
  onChange?: (value: string) => void
  /**
   * 颜色选择器的尺寸
   * @default 200
   */
  size?: number
  /**
   * 开启颜色预览
   */
  preview?: boolean | 'rgb' | 'hex'
}

export const ColorPicker: React.FC<ColorPickerProps>
