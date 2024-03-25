import { Video as TaroVideo, View } from "@tarojs/components"
import './Video.scss'

export const Video = ({ data }) => {
  return <View className='LEV-Video'>
    <TaroVideo className='w-full flex-grow' mode='widthFix' src={data.src} />
  </View>
}
