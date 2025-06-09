/**
 * 2025-06-05更新兼容运行文件
 * 将UI库各组件引用方式修改，例如：
 * Form.Item -> FormItem
 * Form.Submit -> FormSubmit
 * Menu.Item -> MenuItem
 * 这样可以避免将不必要的组件，编译到最终代码里面，减少打包体积
 * 更新后需要将导入和使用方法进行更新，如果你暂时不想更新，则导入这个文件用来兼容，并执行兼容函数
 * import '@/duxui/compatible/250605'
 */

import {
  Avatar, AvatarGroup,
  Card, CardTitle,
  CardSelect, CardSelectGroup,
  Cell, CellGroup,
  Divider, DividerGroup,
  Elevator, ElevatorSearch,
  Checkbox, CheckboxGroup,
  Form, FormItem, FormSubmit, FormReset, FormObject, FormArray, FormArrayAction, useFormContext, useFormItemProxy,
  Image, ImageGroup,
  Input, InputSearch,
  Recorder, recorderStart,
  Radio, RadioGroup,
  LicensePlate, LicensePlateKeyboard, LicensePlateInput, LicensePlateProvider, LicensePlateContext,
  Menu, MenuItem,
  NumberKeyboard, useNumberKeyboardController,
  Status, StatusCommon, StatusIncline,
  SvgEditorController, useSvgEditorController,
  Swiper, SwiperItem,
  Tab, TabItem
} from '../components'

Avatar.Group = AvatarGroup
Card.Title = CardTitle
CardSelect.Group = CardSelectGroup
Cell.Group = CellGroup
Divider.Group = DividerGroup
Elevator.Search = ElevatorSearch
Checkbox.Group = CheckboxGroup
Form.Item = FormItem
Form.Submit = FormSubmit
Form.Reset = FormReset
Form.Object = FormObject
Form.Array = FormArray
Form.ArrayAction = FormArrayAction
Form.useFormContext = useFormContext
Form.useFormItemProxy = useFormItemProxy
Image.Group = ImageGroup
Input.Search = InputSearch
Recorder.start = recorderStart
Radio.Group = RadioGroup
LicensePlate.Keyboard = LicensePlateKeyboard
LicensePlate.Input = LicensePlateInput
LicensePlate.Provider = LicensePlateProvider
LicensePlate.context = LicensePlateContext
Menu.Item = MenuItem
NumberKeyboard.useController = useNumberKeyboardController
Status.Common = StatusCommon
Status.Incline = StatusIncline
SvgEditorController.useController = useSvgEditorController
Swiper.Item = SwiperItem
Tab.Item = TabItem
