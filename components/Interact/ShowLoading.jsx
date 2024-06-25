import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Loading } from '@/duxapp'

import './ShowLoading.scss'

const getSize = size => {
  const { windowWidth } = global.systemInfo
  return 750 / windowWidth * size
}

export const ShowLoading = ({
  text = '请稍后',
  mask
}) => {
  const { windowWidth, windowHeight } = global.systemInfo

  return <>
    {mask && <View className='ShowLoading__mask' />}
    <View className='ShowLoading' style={{
      left: Taro.pxTransform(getSize(windowWidth) / 2 - 100),
      top: Taro.pxTransform(getSize(windowHeight) / 2 - 100),
    }}
    >
      <Loading color='blank' size={64} />
      <Text className='ShowLoading__text'>{text}</Text>
    </View>
  </>
}
