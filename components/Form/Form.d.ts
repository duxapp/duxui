import { CSSProperties, ReactNode } from 'react'
import { SchemaRuleType } from 'b-validate'
import { TextProps } from '../Text'
import { SpaceProps } from '../Space'
import { ButtonProps } from '../Button'

interface Values {
  [key: string]: any
}

interface Direction {
  /** 横向 */
  horizontal
  /** 竖向 */
  vertical
}

interface FormRef {
  /** 表单实时值 */
  values: Values,
  /** 经过计算之后的默认值 */
  defaultValues: Values
  /** 表单结果值 将会在点击提交按钮时改变 */
  data: Values
  /** 通过字段设置表单值 */
  setValue: (field: string, value: any) => void
  /** 批量设置表单值 */
  setValues: (values: Values) => void
  /** 提交表单 */
  submit: () => void
  /** 重置表单 */
  reset: () => void
  /** 验证表单 */
  validate: () => void
}

interface FormChildProps extends FormRef {
  /** 表单属性 */
  labelProps?: TextProps
  /** 全局传递给项目容器的属性 */
  containerProps?: SpaceProps
  /** 表单方向 */
  direction?: keyof Direction
  /** 是否禁用表单 */
  disabled?: boolean
  /** 验证错误信息 */
  validateErrors?: any
}

const FormChild: React.FC<FormChildProps>

interface FormProps {
  /** 表单默认值 */
  defaultValues?: Values | (() => Promise<Values>)
  /** 表单改变事件 当quick参数为true时才会在表单改变是触发，否则会和onSubmit一起触发 */
  onChange?: (values: Values) => void
  /** 表单提交事件 */
  onSubmit?: (values: Values) => void
  /** 是否禁用表单 */
  disabled?: boolean
  /** 方向 */
  direction?: keyof Direction
  /** 全局传递给标签的属性 */
  labelProps?: TextProps
  /** 全局传递给项目容器的属性 */
  containerProps?: SpaceProps
  /** 子元素 */
  children?: ReactNode | FormChild
  /** 表单操作 */
  ref?: (ref: FormRef) => void
}

interface FormItemChildProps extends FormChildProps {
  /** 当前值 */
  value: any
}

const FormItemChild: React.FC<FormItemChildProps>

interface FormItemProps {
  /** 字段名称 */
  field?: string | number
  /**
   * 如果一个表单需要控制多个字段则传入此参数
   * 此参数和field不能同时使用
   * 开启之后 子表单 value将是整个表单的值 onChange 相当于 setValues
   */
  fields?: boolean
  /** 标题 */
  label?: string
  /** 标题属性 */
  labelProps?: TextProps
  /** 项目容器的属性 */
  containerProps?: SpaceProps
  /** 副标题 仅跟着标题渲染 */
  subLabel?: string
  /** 自定义渲染标题右侧区域 一般设置 direction为vertical时使用 */
  renderLabelRight?: ReactNode
  /** 简介 渲染在表单下面 */
  desc?: string
  /** 排列方向 默认为 horizontal */
  direction?: keyof Direction
  /** 是否显示红色星号 不作为验证规则 */
  required?: boolean
  /** 表单默认值 */
  initialValue?: any
  /** 禁用表单 */
  disabled?: boolean
  /** 样式 */
  style?: CSSProperties
  /** 类名 */
  className?: string
  /** 通过哪个事件名称触发表单改变 默认为 onChange */
  trigger?: (value: any) => void
  /** 给表单绑定的值的属性名称 默认为 value */
  triggerPropName?: string
  /** 表单验证规则 详情见 b-validate */
  rules?: SchemaRuleType[]
  /** 子元素 */
  children?: ReactNode | FormItemChild
}

interface FormSubmitProps extends ButtonProps {
  /** 当子元素为ReactNode时，将不会使用按钮创建 当子元素为字符串时，将会创建一个按钮 */
  children: string | ReactNode
}

interface FormObjectProps {
  /** 对象表单值 */
  value: Values
  /** 内容改变时触发事件 */
  onChange?: (values: Values) => void
  /** 子元素 */
  children: ReactNode
}

interface FormArrayItemProps {
  /** 表单值 */
  value: any
  /** 当前表单序号 */
  index: number
  /** 当前数组表单的所有值 */
  values: any[]
}

interface FormArrayContainerProps {
  children: ReactNode
}

const FormArrayItem: React.FC<FormArrayItemProps>

const FormArrayContainer: React.FC<FormArrayContainerProps>

interface FormArrayProps {
  /** 数组表单值 */
  value: any[]
  /** 内容改变时触发事件 */
  onChange?: (values: any[]) => void
  /**
   * 渲染每一项的组件 优先级高于children
   */
  renderItem?: FormArrayItem
  /**
   * 渲染数组表单的头部 渲染在此处的内容才能取到数组表单的 Context
   * 一般来说 ArrayAction 将渲染到此处或者renderBottom 否则 ArrayAction将不会生效
   */
  renderTop?: ReactNode
  /**
   * 渲染数组表单的底部 渲染在此处的内容才能取到数组表单的 Context
   * 一般来说 ArrayAction 将渲染到此处或者renderTop 否则 ArrayAction将不会生效
   */
  renderBottom?: ReactNode
  /** 表单容器组件 如果你要自定义数组表单的外围样式 并且需要获得数组表单的 Context 就可以使用容器组件来处理 */
  itemContainer?: FormArrayContainer
  /** 子元素 */
  children: ReactNode
}

interface FormArrayActionProps {
  /**
   * 数组操作组件 比如增加项目 删除项目 插入项目等
   * @param array 当前数组值
   * @returns 操作后的数组值
   * @example
   * // 新增项目项目
   *  <Form.ArrayAction
   *    action={list => {
   *      list.push('默认值')
   *      return list
   *    }}
   *  >
   *    <Text size={48}>新增</Text>
   *  </Form.ArrayAction>
   */
  action: (array: any[]) => any[]
  /** 子元素 需要是一个就有 onClick 事件的组件 */
  children: ReactNode
}

export const Form: React.FC<FormProps> & {
  /**
   * 表单项 需要放在Form内部
   */
  Item: React.FC<FormItemProps>
  /**
   * 表单提交按钮 点击出发onSubmit事件 需要放在Form内部
   */
  Submit: React.FC<FormSubmitProps>
  /**
   * 表单重置按钮 需要放在Form内部
   */
  Reset: React.FC<FormSubmitProps>
  /**
   * 对象表单 可以将表单结构封装成 {object: {a: 1,b: 2}, other: 1} 这样结构的数据
   * 此组件是一个表单组件 必须放在 Form.Item 的直接子元素中
   */
  Object: React.FC<FormObjectProps>
  /**
   * 数组表单 可以将表单结构封装成 {array: [1,2,3], other: 1} 这样结构的数据
   * 此组件是一个表单组件 必须放在 Form.Item 的直接子元素中
   */
  Array: React.FC<FormArrayProps>
  /**
   * 对数组表单的操作
   * 这个组件需要写在 Form.Array 的renderItem、renderTop、renderBottom或者itemContainer中否则不会生效
   */
  ArrayAction: React.FC<FormArrayActionProps>
  /**
   * 获取表单上下文
   * @returns
   */
  useFormContext: () => FormRef
  /**
   * 给表单代理值和事件
   * @param props
   * @returns
   */
  useFormItemProxy: (props: { value?: any, onChange: (val: any) => void }) => [any, (val: any) => void]
}
