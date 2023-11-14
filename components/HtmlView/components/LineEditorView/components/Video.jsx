import { Video as TaroVideo } from "@tarojs/components"
import './Video.scss'

export const Video = ({ data }) => {
  return <TaroVideo className='LEV-Video w-full' mode='widthFix' src={data.src} />
}
