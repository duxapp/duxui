import { RenderHook } from '@/duxapp'

export * from '@/duxapp/utils'

export { default as duxuiTheme } from '../config/theme'

export * from './interact'

export const duxuiHook = new RenderHook()
