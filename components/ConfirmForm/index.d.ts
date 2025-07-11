import { ComponentType, ReactElement } from 'react'

interface ConfirmFormProps {
  /**
   * 输入标题
   */
  title?: string
  /**
   * 默认值
   */
  defaultValue?: string | number | any
  /**
   * 要渲染的表单，表单项需要从ui库中选择
   * 或者自行封装，需要支持 onChange 事件 和 value 属性
   * @example
   * const name = await confirmForm({
   *   title: '姓名',
   *   form: <Input placeholder='请输入姓名' align='center' />
   * })
   */
  form: ReactElement | ComponentType<any>
  /**
   * 提供验证函数
   * 如果提供，最终必须返回 true 才能验证通过
   * @param val
   * @returns boolean
   */
  verify?: (val: string | number | any) => boolean | Promise<boolean>
  /**
   * 是否多字段表单
   * 开启后可以传入Form的任意子表单
   */
  multiple?: boolean
  /**
   * 是否显示取消按钮
   * @default true
   */
  cancel?: boolean
}

/**
 * 使用api的方式弹出一个表单，并在用户输入后获取用户输入的结果
 * @example
 * const name = await confirmForm({
 *   title: '姓名',
 *   form: <Input placeholder='请输入姓名' align='center' />,
 *   verify: val => {
 *     if (!val) {
 *        return toast('请输入姓名')
 *     }
 *     return true
 *   }
 * })
 */
export const confirmForm: (props: ConfirmFormProps) => Promise<string>
