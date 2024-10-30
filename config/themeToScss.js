const scssData = {
  '': [`// ---- DUXUI模块主题配置 ----`],
  button: [`
// Button组件
$duxuiButtonColor: #000;
$duxuiButtonTextColor: #fff;
$duxuiButtonSFontSize: 24px;
$duxuiButtonSPadding: 20px;
$duxuiButtonSHeight: 50px;
$duxuiButtonMFontSize: 26px;
$duxuiButtonMPadding: 25px;
$duxuiButtonMHeight: 56px;
$duxuiButtonLFontSize: 28px;
$duxuiButtonLPadding: 30px;
$duxuiButtonLHeight: 70px;`],
  tabBar: [`
// TabBar组件
$duxuiTabBarNameColor: #666;
$duxuiTabBarNameHoverColor: #000;`],
  tabs: [`
// Tab组件
$duxuiTabLineWidth: 40px;
$duxuiTabLineHeight: 8px;
$duxuiTabLineRadius: 4px;`],
  avatar: [`
// Avatar组件
$duxuiAvatarColor: #{$duxappPrimaryColor};
$duxuiAvatarBgColor: #eee;
$duxuiAvatarIconSize: 56px;
$duxuiAvatarSSize: 64px;
$duxuiAvatarMSize: 84px;
$duxuiAvatarLSize: 120px;`],
  card: [`
// Card组件
$duxuiCardRadius: #{$duxappCommonRadius};
$duxuiCardMargin: 24px;`],
  divider: [`
// Divider组件
$duxuiDividerPadding: 16px;`],
  formItem: [`
// Form.Item组件
$duxuiFormItemPadding: 24px;
$duxuiFormItemLabelWidth: 140px;`]
}

module.exports = theme => {
  Object.keys(theme).forEach(key => {
    const value = theme[key]
    switch (key) {
      case 'button': {
        if (value.color) {
          scssData.button.push(`$duxuiButtonColor: ${value.color};`)
        }
        if (value.textColor) {
          scssData.button.push(`$duxuiButtonTextColor: ${value.textColor};`)
        }
        if (value.sizes) {
          Object.keys(value.sizes).forEach(size => {
            const { h, p, fs } = value.sizes[size]
            scssData.button.push(`$duxuiButton${size.toUpperCase()}FontSize: ${fs}px;`)
            scssData.button.push(`$duxuiButton${size.toUpperCase()}Padding: ${p}px;`)
            scssData.button.push(`$duxuiButton${size.toUpperCase()}Height: ${h}px;`)
          })
        }
        break
      }
      case 'tabBar': {
        if (value.nameColor) {
          scssData.tabBar.push(`$duxuiTabBarNameColor: ${value.nameColor};`)
        }
        if (value.nameHoverColor) {
          scssData.tabBar.push(`$duxuiTabBarNameHoverColor: ${value.nameHoverColor};`)
        }
        break
      }
      case 'tab': {
        if (value.lineWidth) {
          scssData.tabs.push(`$duxuiTabLineWidth: ${value.lineWidth}px;`)
        }
        if (value.lineHeight) {
          scssData.tabs.push(`$duxuiTabLineHeight: ${value.lineHeight}px;`)
        }
        if (value.lineRadius) {
          scssData.tabs.push(`$duxuiTabLineRadius: ${value.lineRadius}px;`)
        }
        break
      }
      case 'avatar': {
        if (value.color) {
          scssData.avatar.push(`$duxuiAvatarColor: ${value.color};`)
        }
        if (value.bgColor) {
          scssData.avatar.push(`$duxuiAvatarBgColor: ${value.bgColor};`)
        }
        if (value.iconSize) {
          scssData.avatar.push(`$duxuiAvatarIconSize: ${value.iconSize}px;`)
        }
        if (value.sizes?.s) {
          scssData.avatar.push(`$duxuiAvatarSSize: ${value.sizes.s}px;`)
        }
        if (value.sizes?.m) {
          scssData.avatar.push(`$duxuiAvatarMSize: ${value.sizes.m}px;`)
        }
        if (value.sizes?.l) {
          scssData.avatar.push(`$duxuiAvatarLSize: ${value.sizes.l}px;`)
        }
        break
      }
      case 'card': {
        if (value.radius !== undefined) {
          scssData.card.push(`$duxuiCardRadius: ${value.radius}px;`)
        }
        if (value.margin !== undefined) {
          scssData.card.push(`$duxuiCardMargin: ${value.margin}px;`)
        }
        break
      }
      case 'divider': {
        if (value.padding !== undefined) {
          scssData.divider.push(`$duxuiDividerPadding: ${value.padding}px;`)
        }
        break
      }
      case 'formItem': {
        if (value.padding !== undefined) {
          scssData.formItem.push(`$duxuiFormItemPadding: ${value.padding}px;`)
        }
        if (value.labelWidth !== undefined) {
          scssData.formItem.push(`$duxuiFormItemLabelWidth: ${value.labelWidth}px;`)
        }
        break
      }
    }
  })
  return Object.keys(scssData).map(key => {
    scssData[key].splice(1, 0, '\n// 用户样式')
    return scssData[key].join('\n')
  }).join('\n')
}
