import { SvgProps, ImageProps, TextProps, PathProps, TransformProps, RectProps, LineProps, EllipseProps } from 'react-native-svg'
import { ColumnProps } from '../Flex'

type Value = {
  type: 'Image' | 'Text' | 'Path' | 'Ellipse' | 'Line' | 'Rect'
  attr: ImageProps | TextProps | PathProps | RectProps | LineProps | EllipseProps
  transform?: TransformProps
  layout?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface SvgEditorProps extends SvgProps {
  defaultValue?: Value[]
  onChange?: (value: Value[]) => void
  /**
   * 模式
   */
  mode?: 'path' | 'text' | 'ellipse' | 'line' | 'rect'
  /**
   * 传递给绘画模式的样式
   */
  pathProps?: PathProps
  /**
   * 文本输入样式
   */
  textProps?: TextProps
  /**
   * 绘制椭圆样式
   */
  ellipseProps?: EllipseProps
  /**
   * 绘制线条样式
   */
  lineProps?: LineProps
  /**
   * 绘制矩形样式
   */
  rectProps?: RectProps
}

interface SvgEditorRef {
  add: (...values: Value[]) => void
}

interface SvgEditorControllerProps extends ColumnProps {
  mode: 'path' | 'text' | 'ellipse' | 'line' | 'rect'
  setMode: () => void
  /**
   * 注册一个异步函数，获取本地图片路径
   */
  selectImage: () => Promise<string>
  /**
   * 编辑器的ref引用
   */
  editor: {
    current: SvgEditorRef
  }
  path: {
    values: PathProps,
    onChange: () => void
  }
  text: {
    values: TextProps,
    onChange: () => void
  }
  rect: {
    values: RectProps,
    onChange: () => void
  }
  ellipse: {
    values: EllipseProps,
    onChange: () => void
  }
  line: {
    values: LineProps,
    onChange: () => void
  }
}

/**
 * SVG编辑器
 */
export const SvgEditor: React.FC<SvgEditorProps> & SvgEditorRef

/**
 * SVG编辑器控制器
 */
export const SvgEditorController: React.FC<SvgEditorControllerProps>

export const useSvgEditorController: () => {
  /**
   * 传递给编辑器的属性
   */
  editor: SvgEditorProps
  /**
   * 传递给控制器的属性
   */
  controller: SvgEditorControllerProps
}
