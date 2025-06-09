import { SwiperProps as TaroSwiper, SwiperItemProps as TaroSwiperItem } from '@tarojs/components/types'
import { CSSProperties, ReactNode } from 'react'

interface SwiperProps extends TaroSwiper {
  /** 是否显示指示点 */
  dot?: boolean
  /** 指示点颜色 */
  dotColor?: string
  /** 活动的指示点颜色 */
  dotSelectColor?: string
  /** 指示点到边框的距离 */
  dotDistance?: number
}

interface SwiperItemProps extends TaroSwiperItem {

}

/**
 * 幻灯片
 */
export const Swiper: React.FC<SwiperProps>

/**
 * 幻灯片
 */
export const SwiperItem: React.FC<SwiperItemProps>
