import { px } from '@/duxapp'
import { Swiper as TaroSwiper, SwiperItem as TaroSwiperItem } from '@tarojs/components'
import { useState, Children } from 'react'
import { Column, Row } from '../Flex'

export const Swiper = ({
  children,
  className,
  style,
  defaultCurrent = 0,
  autoplay,
  interval = 4000,
  circular,
  vertical,
  dot,
  dotColor = '#fff',
  dotSelectColor = dotColor,
  dotDistance = 24,
  ...props
}) => {

  const [current, setCurrent] = useState(defaultCurrent)

  return <Column style={style} className={className}>
    {Children.count(children) > 0 && <TaroSwiper
      className='h-full w-full'
      autoplay={autoplay}
      interval={interval}
      circular={circular}
      vertical={vertical}
      // current={current}
      onAnimationFinish={e => setCurrent(e.detail.current)}
      indicatorDots={false}
      {...props}
    >
      {children}
    </TaroSwiper>}
    {dot && !!children?.length && <Row className='gap-1 absolute w-full z-1' justify='center' style={{ bottom: px(dotDistance) }}>
      {
        children.map((v, i) => <Column
          key={i}
          style={{ width: px(current === i ? 32 : 16), height: px(16), backgroundColor: current === i ? dotSelectColor : dotColor }}
          className='r-1 bg-white'
        />)
      }
    </Row>}
  </Column>
}

export const SwiperItem = props => {
  return <TaroSwiperItem {...props} />
}
