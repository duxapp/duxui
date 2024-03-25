import { previewImage } from '@tarojs/taro'
import { Image as BaseImage } from '@tarojs/components'
import { createContext, useRef, useCallback, useContext, useMemo, useEffect, memo } from 'react'
import classNames from 'classnames'
import { noop } from '@/duxapp'
import { duxuiTheme } from '@/duxui/utils'
import { View } from '../common/View'
import './index.scss'

const context = createContext({
  group: false,
  addImage: noop,
  removeImage: noop,
  preview: (url, images = []) => {
    previewImage({
      current: images.length && !images.includes(url) ? images[0] : url,
      urls: images.length ? images : [url]
    })
  }
})

const ImageGroup = ({ children }) => {

  const images = useRef([])

  const addImage = useCallback(url => {
    images.current.push(url)
  }, [])

  const removeImage = src => {
    const index = images.current.indexOf(src)
    if (~index) {
      images.current.splice(index, 1)
    }
  }

  const preview = useCallback(url => {
    previewImage({
      current: url,
      urls: images.current
    })
  }, [])

  return <context.Provider value={{ addImage, removeImage, preview, group: true }}>
    {children}
  </context.Provider>

}

export const Image = memo(({
  src,
  preview,
  images,
  radiusType = duxuiTheme.image.radiusType,
  className,
  onClick,
  style,
  square,
  ...props
}) => {

  const data = useContext(context)

  useMemo(() => {
    data.addImage(src)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  useEffect(() => {
    return () => data.removeImage(src)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  const click = useCallback(e => {
    if (onClick) {
      onClick(e)
    } else {
      (preview || data.group) && data.preview(src, images)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.group, data.preview, onClick, preview, src, images])

  if (square) {
    return <View className={classNames('Image--img-square__root Image', 'Image--' + radiusType, className)} style={style}>
      <BaseImage
        className={classNames('Image--img-square', process.env.TARO_ENV !== 'weapp' && 'Image--img-square--height')}
        mode='aspectFill'
        src={src}
        {...onClick || preview || data.group ? { onClick: click } : {}}
        {...props}
      />
    </View>
  }
  return <BaseImage
    className={classNames('Image', 'Image--' + radiusType, className)}
    mode='aspectFill'
    src={src}
    style={style}
    {...onClick || preview || data.group ? { onClick: click } : {}}
    {...props}
  />
})

Image.Group = ImageGroup
