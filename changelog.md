# 1.0.23
## Avatar
优化头像默认值

## UploadImages
修图图片上传组件样式问题

## 新增ScrollViewManage组件
组件用于管理ScrollView组件的刷新状态，提供给多个子元素刷新方法

## TabBar
修复组件会多次刷新的问题

## Tab
新增 `oneHidden` 属性，只有一个Tab选项的时候隐藏Tab

## Types
完善多个组件的代码提示

# 1.0.20

## 新增NumberKeyboard组件
此组件为数字键盘，可以对诸如验证码输入、支付密码输入等环节进行输入优化

## 新增InputCode组件
验证码或者密码输入组件，此组件需配合NumberKeyboard一起使用，使用示例参考示例模块(duxuiExample)

# 1.0.17
## Image
- [修复] square属性在h5下不显示图片
## Grid
- [修复] 过滤无效的子元素

# 1.0.16
## 新增Status组件
组件用于显示在四角的状态，提供两个默认组件,使用方法如下
```jsx
<View className='bg-white items-center justify-center overflow-hidden' style={{ height: px(300) }}>
  <Text>这是内容</Text>
  <Status status={<Status.Incline>状态1</Status.Incline>} />
  <Status horizontal='right' status={<Status.Incline>状态2</Status.Incline>} />
  <Status horizontal='right' vertical='bottom' status={<Status.Incline>状态3</Status.Incline>} />
  <Status status={<Status.Common type='success'>状态</Status.Common>} />
</View>
```

## Tab
- [新增] 新增`badgeProps`属性 用于在Tab项目上显示红点

## Divider
- [新增] `padding`支持通过主题配置默认值

# 1.0.15

## Tab
- [新增] 新增`tabStyle`属性用于控制tab部分的样式
- [修复] RN下 滚动模式下不在左边的问题

## Form
- [新增] 新增`containerProps`属性用于控制`Form.Item`容器的样式

## Empty
- [优化] 替换默认图片

## Card
- [新增] `Card.Title`组件新增样式和类属性

## Calendar
- [新增] 新增`navStyle`和`headStyle`属性用于用户控制导航部分和周导航部分样式
- [优化] 删除默认的白色背景

## Button
- [修复] plan模式下type为custom不生效的问题

## Badeg
- [优化] 优化为点状时的默认颜色

## Image
- [新增] 新增`square`属性，控制是否显示为正方形，使用此属性需要指定width

## Grade
- [新增] 新增`type`属性，控制颜色

## Radio
- [新增] 新增`checked`属性，控制是否选中
- [新增] 新增`onClick`属性，监听点击事件

## HtmlView
- [修复] 修复图片无法预览

## Tag
- [新增] 添加了默认样式

## Text
- [优化] 优化了Text的渲染性能


# 1.0.8

## 更新说明

- [新增] 日历组件支持自定义日期
- [新增] 日历组件支持传入自定义禁用日期
- [types] 补全表单相关代码提示

# 1.0.0

## 更新说明

发布首个版本
