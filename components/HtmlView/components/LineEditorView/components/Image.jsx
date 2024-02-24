import { Image as TaroImage } from '@tarojs/components'
import classNames from 'classnames'
import './Image.scss'

export const Image = ({ data, onClick, imageSpace }) => {
  if (!data?.src) {
    return null
  }
  return <TaroImage
    onClick={onClick}
    className={classNames('LEV-Image w-full', imageSpace && 'LEV-Image__space')}
    mode='widthFix' src={data.src}
    resizeMethod='scale'
  />
}
