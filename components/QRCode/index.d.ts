interface QRCodeViewProps {
  /**
   * 二维码内容
   * @default duxui
   */
  value?: string
  /**
   * 尺寸
   * @default 100
   */
  size?: number
  /**
   * 颜色
   * @default black
   */
  color?: string
  /**
   * 背景颜色
   * @default white
   */
  backgroundColor?: string
  /**
   * Logo图片地址
   */
  logo?: string
  /**
   * Logo尺寸
   * @default size * 0.2
   */
  logoSize?: number
  /**
   * logo背景颜色，如果logo是png，有头部明部分才会生效
   * @default transparent
   */
  logoBackgroundColor?: string
  /**
   * logo外边距，和二维码之间的间隙
   * @default 2
   */
  logoMargin?: number
  /**
   * Logo圆角
   * @default 0
   */
  logoBorderRadius?: number
  /**
   * 是否开启渐变颜色
   */
  enableLinearGradient?: boolean
  /**
   * 指定渐变方向 x1 y1 x2 y2
   * @default ['0%', '0%', '100%', '100%']
   */
  gradientDirection?: [number, number, number, number]
  /**
   * 指定渐变颜色
   * @default ['rgb(255,0,0)', 'rgb(0,255,255)']
   */
  linearGradient?: [string, string]
  /**
   * 周围空白区域大小
   * @default 0
   */
  quietZone?: number
  /**
   * 纠错级别，使用文档
   * https://github.com/soldair/node-qrcode?tab=readme-ov-file#errorcorrectionlevel
   * @default M
   */
  ecl?: 'L' | 'M' | 'Q' | 'H'
  /**
   * 生成错误回调函数
   * @returns
   */
  onError?: (error: Error) => void
}


export const QRCode: React.FC<QRCodeViewProps>
