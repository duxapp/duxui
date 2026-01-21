import { RenderHook } from '@/duxapp'

export * from '@/duxapp/utils'

export { default as duxuiTheme } from '../config/theme'
export * from './lang'

export const duxuiHook = new RenderHook()

/**
 * 编译优化
 * @returns
 */
export const pure = callback => callback()
