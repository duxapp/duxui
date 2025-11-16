
type list = string[] | { name: string, callback?: () => any, children?: list }[]

/**
 * 显示有个菜单
 * 类似于PC端的右键菜单，通过右键点击，在点击位置弹出菜单
 */
export const showContextMenu: (option: {
  /**
   * 菜单显示的x坐标
   * 需要真实坐标
   */
  x: string
  /**
   * 菜单显示的y坐标
   * 需要真实坐标
   */
  y: string | ReactElement
  /**
   * 菜单列表
   */
  list: list,
  /**
   * 开启动画
   * 默认 true
   */
  animation?: boolean
  /**
   * 如果只有一项菜单，是否立即返回这一项菜单结果，不弹出选择
   */
  oneCallback?: boolean
}) => Promise<{
  // 选中的菜单
  index: number
  // 选中菜单名称
  item: string
}>
