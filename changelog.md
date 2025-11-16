# 1.0.51

## 表单
完善了所有表单，支持非受控模式、禁用表单、设置默认值等功能

## PickerSelect

新增 `search` ，开启后用于搜索选项

## Switch

新增 `values` 属性，用于指定开关不同状态的值

## Textarea
优化了文本显示

## 兼容新CLI

将npm依赖选项移动到package.json文件中

# 1.0.48

## 图标组件
将图标放在本地，防止偶尔出现图标不显示的问题

## loading
此函数已经移动到基础模块中

## ModalForm
新增 `onSubmitBefore` 可以监听用户提交，通过抛出错误的方式阻止用户提交

## 修复一些H5端导致热重载报错的问题
并未完全修复

# 1.0.47

## List
在小程序端新增虚拟列表功能，这需要手动开启，且有一些使用限制

## Checkbox
新增部分选中属性

## Avatar
修复主题配置不生效的问题

## 主题
修复ui模块主题配置不生效的问题

## Types
修复了一些类型提示

# 1.0.45

## Recorder
新增录音表单组建，用于录音上传

## Upload
完善对视频、图片上传的预览功能

## Step
新增 `lineType` 指定线条的类型

## Cascade
修复对RN的兼容

## Types
修复多个组建的types提示

# 1.0.41

## 主要更改
- Taro更新到4.0.5 RN更新到0.75
- 完善大量组件类型提示
- 完善开发文档[http://duxapp.com/](http://duxapp.com/)
- 完善多个组件
- 优化从Taro导入组件的防止兼容新版本RN

## UploadImage

将上传图片的组件统一更换为Upload，支持图片和视频上传

## Sign
去除组件的flex:1属性，需要手动设置组件的高度

# 1.0.37
## LinearGradient
修复RN设置rgba不显示透明度的问题

## Cell
Cell.Group 添加样式属性支持

## Checkbox Radio
新增 disabled 用于禁用选项

## FormItem
- label属性如果为传入，则和原来逻辑一致，label传入空字符串则会按照传入的逻辑，但是不显示label内容，即可以显示desc，可以显示验证错误等
- 修复 rules 在组件卸载之后不清除的问题
- 新增 itemPadding 属性，boolean类型，可以设置开启或者关闭当前项目的内边距，默认开启
- 将 direction 属性更改为 vertical，用于指定是否竖向布局
- 新增两个主题配置，用于配置项目内边距和label的宽度

## Form
- 新增 itemPadding 属性，boolean类型，可以设置开启或者关闭项目的内边距，默认开启
- 将 direction 属性更改为 vertical，用于指定是否竖向布局

## UploadImages UploadImage
新增 option 属性，将会传入到上传函数的参数属性

## 其他修复
- 修复Input值可能不正确的问题
- Status type 属性新增 default

# 1.0.34
## Calendar
- 新增onDayClick属性，点击某一天的事件，可以返回 true 阻止默认操作，如选中日历
- 修复RN端显示错乱
- 修复types

## Grade
修复分数有小数时，显示错误的问题

## UploadImages
图片上传在RN端支持权限提示说明，此功能在华为APP上架时强制需求

## Divider
- [破坏性更新]移除了padding属性，后续将不支持此属性
- 修改 direction 属性为 vertical 属性
- 修改Group组件 row 属性为 vertical 属性

## 其他优化
- 优化confirm显示
- 修复H5端Picker相关组件失效问题
- 修复Swiper可能显示0的问题

# 1.0.31
## HorseLanternLottery
新增跑马灯抽奖组件，使用示例如下，请安装ui库示例查看详情
```jsx
import { Column, Header, HorseLanternLottery, Text, TopView, duxappTheme, px, GroupList, ScrollView, confirm } from '@/duxuiExample'

export default function HorseLanternLotteryExample() {

  return (
    <TopView isSafe>
      <Header title='HorseLanternLottery' />
      <ScrollView>
        <GroupList>
          <GroupList.Item title='随机结果'>
            <HorseLanternLottery
              list={list}
              renderItem={Item}
              onEnd={res => console.log('抽奖结果', res.index)}
              renderStart={<Column grow className='items-center justify-center'>
                <Text>开始</Text>
              </Column>}
            />
          </GroupList.Item>
          <GroupList.Item title='异步获取结果'>
            <HorseLanternLottery
              list={list}
              renderItem={Item}
              onStart={async () => {
                const status = await confirm({
                  content: '点击确定选中奖品3，点击取消取消抽奖'
                })
                if (status) {
                  return 2
                }
                throw '取消'
              }}
              onEnd={res => console.log('抽奖结果', res.index)}
              renderStart={<Column grow className='items-center justify-center'>
                <Text>开始</Text>
              </Column>}
            />
          </GroupList.Item>
          <GroupList.Item title='指定行和列'>
            <HorseLanternLottery
              list={list}
              column={4}
              row={4}
              renderItem={Item}
              onEnd={res => console.log('抽奖结果', res.index)}
              renderStart={<Column grow className='items-center justify-center'>
                <Text>开始</Text>
              </Column>}
            />
          </GroupList.Item>
          <GroupList.Item title='自定义间距'>
            <HorseLanternLottery
              list={list}
              gap={64}
              renderItem={Item}
              onEnd={res => console.log('抽奖结果', res.index)}
              renderStart={<Column grow className='items-center justify-center'>
                <Text>开始</Text>
              </Column>}
            />
          </GroupList.Item>
          <GroupList.Item title='禁用抽奖'>
            <HorseLanternLottery
              disabled
              list={list}
              onDisabledClick={() => confirm({ content: '抽奖次数已经用完了' })}
              renderItem={Item}
              onEnd={res => console.log('抽奖结果', res.index)}
              renderStart={<Column grow className='items-center justify-center'>
                <Text>抽奖次数已用完</Text>
              </Column>}
            />
          </GroupList.Item>
        </GroupList>
      </ScrollView>
    </TopView>
  )
}

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const Item = ({ item, index, select }) => {
  return <Column className='bg-white items-center justify-center'
    style={
      select ?
        {
          borderColor: duxappTheme.primaryColor,
          borderWidth: 3,
          height: px(180)
        } :
        {
          height: px(180)
        }
    }
  >
    <Text>奖品{item}</Text>
  </Column>
}
```

## 其他
- 修复 `Form.Item` 可能报错
- 修复Modal TS提示
- Status 优化显示
- Swiper 修复属性无效

# 1.0.30
## TopView
add 方法新增分组属性，多次调用add时，指定了同一个分组的元素，将会以队列的形式展示，即同时只会展示一个，当移除当前展示的内容后，会立即展示下一个
```jsx
TopView.add(element, { group: '分组' })
```
对应的以下组件都新增了此属性
- PullView
- Absolute
- Modal  
当这些组件指定了相同的属性时，将会加入展示队列
```jsx
<PullView group='group'>
  <Text>内容</Text>
</PullView>
<Modal show group='group'>
  <Text>内容</Text>
</Modal>
<Absolute group='group'>
  <Text>内容</Text>
</Absolute>
```

## confirm
- 新增 `renderTop` `renderBottom` 属性，用于自定义渲染弹窗顶部和底部的内容
- 返回的task新增 `confirm` `cancel` `close` 方法，分别用于触发确定、取消、reject
```js
try {
  const task = confirm({
    title: '提示',
    content: '这是一个任务',
    renderBottom: <Text onClick={() => task.close()}>关闭</Text>
  })
  const status = await task
  if(status) {
    console.log('用户点击了确定')
  } else {
    console.log('用户点击了取消')
  }
} catch (error) {
  console.log('用户点击了关闭')
}

```

## Calendar
新增 `enabledDate` 属性，表示可用的日期 除了传入的日期或者范围，其他的日期将被禁用，当 enabledDate 的日期在 disabledDate 里面时 此日期将不可用

## TabBar
删除不必要的 dom 节点

## ModalForms
修复设置多个值时，设置不成功

# 1.0.29

## 在UI库新增duxuiHook的渲染钩子
首先用在Button组建中，钩子的作用是拦截、插入一些渲染到指定的位置，使用的示例：
```jsx
import { Text, duxappTheme, duxuiHook } from '@/duxui'
import { cloneElement } from 'react'

const ButtonHook = ({ props, children }) => {
  if (props.type !== 'primary') {
    return children
  }
  return cloneElement(children, {
    style: {
      ...children.props?.style,
      backgroundColor: duxappTheme.textColor1
    },
    children: <Text type='primary' className={`${'Button--fs-' + (props.size || 'm')}`}>{props.children}</Text>
  })
}

duxuiHook.add('Button', ButtonHook)
```
在这个示例中，拦截了Button的渲染，当指定属性 type 为 primary时，将以另外一个样式进行渲染  

现在仅在按钮组建中加入了钩子，后面会考虑加入更多钩子

## Calendar
日历新增 `checkbox` 参数，用于指定多选，单日、范围、星期都支持多选

## Tab
新增 `getItemStyle` 属性，可以通过回调的方式指定一些样式，使用示例
```jsx
const getItemStyle = useCallback(({ select }) => {
  if (isShop) {
    return {}
  }
  if (select) {
    return {
      line: {
        backgroundColor: '#fff'
      },
      text: {
        color: '#fff'
      }
    }
  } else {
    return {
      text: {
        color: 'rgba(255,255,255,0.7)'
      }
    }
  }
}, [isShop])
```

# 1.0.27
## Badeg
新增style支持

## Calendar
新增 `onMonthChange` 事件，在用户切换月份的时候触发，默认月份也会触发  
优化文本颜色为为主题色

## Checkbox
新增 `virtual` 属性，可以把多选组设置为虚拟组件，不会生成实体dom

## Radio
新增 `virtual` 属性，可以把多选组设置为虚拟组件，不会生成实体dom

## From
优化当未设置 field 属性时，其功能将不起作用

## HtmlView
优化H5端间距及行高  
修复RN端可能会闪烁的问题

## PikcerDate
当未设置时，设置默认值为当天

## Sign
小程序端用2d模式重写  
新增未签名验证 当笔画过少时会抛出错误  
修复小程序清除功能无效

## TabBar
新增 `onChange` 属性，当切换TabBar项目时触发
新增 `style` `className` 属性

## Video
修复Video显示问题

# 1.0.26
## TouchableOpacity
新增触摸反馈组件

# 1.0.25

## LicensePlate
新增车牌号码输入键盘组件
```jsx
<LicensePlate length={7} onChange={val => console.log(val)} />
```

# 1.0.24

## Absolute
将此组件移动到duxapp基础模块

## PullView
将此组件移动到duxapp基础模块

## BoxShowdow
- 将此组件RN端的实现方法从SVG替换为一个原生组件，极大提高渲染性能
- 移除radius属性
- 统一RN和其他端的属性

## Textarea
统一h5端背景颜色

## HtmlView
修复h5端视频高度错误

## Image
修复无法预览的问题

## Link
新增Link组件，用来跳转链接

## Swiper
新增幻灯片组件

## Video
新增视频播放组件

## Types
修复、补全了多个组件的代码提示

## 其他
- 组件全面支持design设计器

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
- [新增] 新增`soft`属性：无边框，背景为当前文本颜色减淡约0.9的浅色，类似`plain`但带浅色背景；可与`plain`同时使用（此时显示描边）

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
