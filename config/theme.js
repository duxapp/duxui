/**
 * 默认主题配置
 */

import { duxappTheme } from '@/duxapp'

export default {
  button: {
    // color: '#000',
    radiusType: 'round-min', // 按钮圆角类型 square直角 round圆角 round-min较小的圆角
    size: 'm', // 按按钮尺寸 s m l
    plain: false, // 是否镂空
    sizes: {
      s: { fs: 24, p: 20, h: 50 },
      m: { fs: 28, p: 30, h: 70 },
      l: { fs: 32, p: 40, h: 90 }
    }
  },

  tabBar: {
    nameColor: '#666',
    nameHoverColor: '#000'
  },

  tab: {
    lineWidth: 30,
    lineHeight: 8,
    lineRadius: 4
  },

  tag: {
    radiusType: 'round-min', // 按钮圆角类型 square直角 round圆角 round-min较小的圆角
  },

  avatar: {
    size: 'm',
    color: duxappTheme.primaryColor,
    bgColor: '#eee',
    radiusType: 'round', // 按钮圆角类型 square直角 round圆角 round-min较小的圆角
    iconSize: 64,
    sizes: {
      s: 64,
      m: 84,
      l: 120
    }
  },

  card: {
    shadow: true,
    radius: duxappTheme.common.radiusValue,
    margin: 24
  },

  image: {
    radiusType: 'square',  // 按钮圆角类型 square直角 round-min较小的圆角
  },

  cardSelect: {
    color: duxappTheme.primaryColor,
    radiusType: 'round-min', // 按钮圆角类型 square直角 round圆角 round-min较小的圆角
  },

  divider: {
    padding: 16
  },

  formItem: {
    padding: 24,
    labelWidth: 140
  }
}
