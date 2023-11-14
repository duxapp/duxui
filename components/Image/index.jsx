import Taro from '@tarojs/taro'
import { Image as BaseImage } from '@tarojs/components'
import { createContext, useRef, useCallback, useContext, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import { noop } from '@/duxapp'
import { duxuiTheme } from '@/duxui/utils'
import './index.scss'

const context = createContext({
  group: false,
  addImage: noop,
  removeImage: noop,
  preview: (url, images = []) => {
    Taro.previewImage({
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
    Taro.previewImage({
      current: url,
      urls: images.current
    })
  }, [])

  return <context.Provider value={{ addImage, removeImage, preview, group: true }}>
    {children}
  </context.Provider>

}

export const Image = ({
  src,
  preview,
  images,
  radiusType = duxuiTheme.image.radiusType,
  className,
  onClick,
  style,
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

  return <BaseImage
    className={classNames('Image', 'Image--' + radiusType, className)}
    mode='aspectFill'
    src={src}
    {...onClick || preview || data.group ? { onClick: click } : {}}
    style={style}
    {...props}
  />
}

Image.Group = ImageGroup
