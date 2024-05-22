import { Video as TaroVideo } from '@tarojs/components'
import classNames from 'classnames'
import { Column } from '../Flex'

export const Video = ({
  src,
  controls = false,
  autoplay,
  loop,
  muted,
  direction,
  showFullscreenBtn = false,
  showPlayBtn = false,
  showCenterPlayBtn = false,
  poster,
  title,
  className,
  style,
  ...props
}) => {
  return <Column className={classNames('overflow-hidden', className)} style={style} {...props}>
    <TaroVideo
      src={src}
      className='w-full h-full'
      controls={controls}
      autoplay={autoplay}
      loop={loop}
      muted={muted}
      direction={direction}
      showFullscreenBtn={showFullscreenBtn}
      showPlayBtn={showPlayBtn}
      showCenterPlayBtn={showCenterPlayBtn}
      poster={poster}
      title={title}
    />
  </Column>
}
