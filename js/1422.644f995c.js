"use strict";(self.webpackJsonp=self.webpackJsonp||[]).push([[1422],{"1422":function(t,e,n){n.r(e),n.d(e,{"default":function(){return ButtonExample}});var r=n(1413),o=n(9439),u=n(6493),a=n(7218),i=n(9748),c=n(8311);function ButtonExample(){var t=(0,i.useState)(),e=(0,o.Z)(t,2),n=e[0],d=e[1],l=(0,i.useState)(!1),f=(0,o.Z)(l,2),s=f[0],m=f[1],p=(0,i.useState)(!1),h=(0,o.Z)(p,2),b=h[0],C=h[1],k=(0,i.useState)(!1),T=(0,o.Z)(k,2),y=T[0],x=T[1],Z=(0,i.useMemo)((function(){return[{"date":[(0,a.dayjs)().format("YYYY-MM-DD")],"bottom":function bottom(t){var e=t.select;return(0,c.tZ)(a.Text,(0,r.Z)((0,r.Z)({"size":1,"type":"primary"},e?{"color":4}:{}),{},{"children":"今天"}))},"top":function top(t){var e=t.select;return(0,c.tZ)(a.Text,{"size":1,"color":e?4:1,"children":"顶部"})}},{"date":[(0,a.dayjs)().add(-1,"day").format("YYYY-MM-DD")],"bottom":function bottom(t){var e=t.select;return(0,c.tZ)(a.Text,(0,r.Z)((0,r.Z)({"size":1,"type":"secondary"},e?{"color":4}:{}),{},{"children":"昨天"}))}},{"date":[(0,a.dayjs)().add(1,"day").format("YYYY-MM-DD")],"bottom":function bottom(t){var e=t.select;return(0,c.tZ)(a.Text,(0,r.Z)((0,r.Z)({"size":1,"type":"secondary"},e?{"color":4}:{}),{},{"children":"明天"}))}}]}),[]),g=(0,i.useMemo)((function(){return{"top":function top(t){t.select;var e=t.selectType;return"start"===e?(0,c.tZ)(a.Text,{"size":1,"color":4,"children":"开始"}):"end"===e?(0,c.tZ)(a.Text,{"size":1,"color":4,"children":"结束"}):"select"===e?(0,c.tZ)(a.Text,{"size":1,"color":4,"children":"选中"}):void 0}}}),[]);return(0,c.BX)(u.TopView,{"children":[(0,c.tZ)(u.Header,{"title":"Calendar"}),(0,c.tZ)(u.ScrollView,{"children":(0,c.BX)(u.GroupList,{"children":[(0,c.BX)(u.GroupList.Item,{"title":"天选择","children":[(0,c.BX)(a.Radio.Group,{"value":n,"onChange":d,"children":[(0,c.tZ)(a.Radio,{"value":void 0,"label":"不选择"}),(0,c.tZ)(a.Radio,{"value":"day","label":"天选择"}),(0,c.tZ)(a.Radio,{"value":"scope","label":"范围选择"}),(0,c.tZ)(a.Radio,{"value":"week","label":"周选择"})]}),(0,c.BX)(a.Row,{"className":"gap-3 items-center","children":[(0,c.tZ)(a.Checkbox,{"label":"多选","checked":s,"onClick":function onClick(){return m(!s)}}),(0,c.tZ)(a.Checkbox,{"label":"仅显示当前周","checked":b,"onClick":function onClick(){return C(!b)}}),(0,c.tZ)(a.Checkbox,{"label":"限制最大最小日期","checked":y,"onClick":function onClick(){return x(!y)}})]}),(0,c.tZ)(a.Calendar,(0,r.Z)({"mode":n,"checkbox":s,"onlyCurrentWeek":b},y?{"min":(0,a.dayjs)().format("YYYY-MM-DD"),"max":(0,a.dayjs)().add(15,"day").format("YYYY-MM-DD")}:{}),n+""+s)]}),(0,c.tZ)(u.GroupList.Item,{"title":"事件","children":(0,c.tZ)(a.Calendar,{"mode":"day","onMonthChange":function onMonthChange(t){return(0,a.toast)("onMonthChange:"+t)},"onDayClick":function onDayClick(t){return(0,a.toast)("onDayClick:"+t.day)}})}),(0,c.tZ)(u.GroupList.Item,{"title":"自定义日历","children":(0,c.tZ)(a.Calendar,{"mode":"scope","customDate":Z,"customSelect":g})})]})})]})}},"6493":function(t,e,n){n.d(e,{"Avatar":function(){return r.Avatar},"Badge":function(){return r.Badge},"BoxShadow":function(){return r.BoxShadow},"Button":function(){return r.Button},"Card":function(){return r.Card},"CardSelect":function(){return r.CardSelect},"Cell":function(){return r.Cell},"Column":function(){return r.Column},"Divider":function(){return r.Divider},"DropDown":function(){return r.DropDown},"Empty":function(){return r.Empty},"Grid":function(){return r.Grid},"GroupList":function(){return r.GroupList},"HorseLanternLottery":function(){return r.HorseLanternLottery},"HtmlView":function(){return r.HtmlView},"Image":function(){return r.Image},"LicensePlate":function(){return r.LicensePlate},"LinearGradient":function(){return r.LinearGradient},"LongPress":function(){return r.LongPress},"Menu":function(){return r.Menu},"Modal":function(){return r.Modal},"NumberKeyboard":function(){return r.NumberKeyboard},"Row":function(){return r.Row},"Space":function(){return r.Space},"Status":function(){return r.Status},"Step":function(){return r.Step},"Tab":function(){return r.Tab},"TabBar":function(){return o.nj},"Tag":function(){return r.Tag},"TestIcon":function(){return r.TestIcon},"Text":function(){return r.Text},"TouchableOpacity":function(){return r.TouchableOpacity},"confirm":function(){return o.iG},"createTabBar":function(){return r.createTabBar},"duxappTheme":function(){return o.Qk},"loading":function(){return o.V_},"message":function(){return o.yw},"nav":function(){return o.$n},"px":function(){return o.px},"toast":function(){return o.Am}});var r=n(4830);n.o(r,"Absolute")&&n.d(e,{"Absolute":function(){return r.Absolute}}),n.o(r,"Cascade")&&n.d(e,{"Cascade":function(){return r.Cascade}}),n.o(r,"Checkbox")&&n.d(e,{"Checkbox":function(){return r.Checkbox}}),n.o(r,"DatePicker")&&n.d(e,{"DatePicker":function(){return r.DatePicker}}),n.o(r,"Form")&&n.d(e,{"Form":function(){return r.Form}}),n.o(r,"Grade")&&n.d(e,{"Grade":function(){return r.Grade}}),n.o(r,"Header")&&n.d(e,{"Header":function(){return r.Header}}),n.o(r,"Input")&&n.d(e,{"Input":function(){return r.Input}}),n.o(r,"InputCode")&&n.d(e,{"InputCode":function(){return r.InputCode}}),n.o(r,"Layout")&&n.d(e,{"Layout":function(){return r.Layout}}),n.o(r,"Loading")&&n.d(e,{"Loading":function(){return r.Loading}}),n.o(r,"ModalForm")&&n.d(e,{"ModalForm":function(){return r.ModalForm}}),n.o(r,"ModalForms")&&n.d(e,{"ModalForms":function(){return r.ModalForms}}),n.o(r,"PickerDate")&&n.d(e,{"PickerDate":function(){return r.PickerDate}}),n.o(r,"PickerMultiSelect")&&n.d(e,{"PickerMultiSelect":function(){return r.PickerMultiSelect}}),n.o(r,"PickerSelect")&&n.d(e,{"PickerSelect":function(){return r.PickerSelect}}),n.o(r,"PullView")&&n.d(e,{"PullView":function(){return r.PullView}}),n.o(r,"Radio")&&n.d(e,{"Radio":function(){return r.Radio}}),n.o(r,"ScrollView")&&n.d(e,{"ScrollView":function(){return r.ScrollView}}),n.o(r,"Switch")&&n.d(e,{"Switch":function(){return r.Switch}}),n.o(r,"TabBar")&&n.d(e,{"TabBar":function(){return r.TabBar}}),n.o(r,"Textarea")&&n.d(e,{"Textarea":function(){return r.Textarea}}),n.o(r,"TopView")&&n.d(e,{"TopView":function(){return r.TopView}}),n.o(r,"UploadImage")&&n.d(e,{"UploadImage":function(){return r.UploadImage}}),n.o(r,"UploadImages")&&n.d(e,{"UploadImages":function(){return r.UploadImages}}),n.o(r,"confirm")&&n.d(e,{"confirm":function(){return r.confirm}}),n.o(r,"duxappTheme")&&n.d(e,{"duxappTheme":function(){return r.duxappTheme}}),n.o(r,"loading")&&n.d(e,{"loading":function(){return r.loading}}),n.o(r,"message")&&n.d(e,{"message":function(){return r.message}}),n.o(r,"nav")&&n.d(e,{"nav":function(){return r.nav}}),n.o(r,"px")&&n.d(e,{"px":function(){return r.px}}),n.o(r,"toast")&&n.d(e,{"toast":function(){return r.toast}});var o=n(1774)}}]);