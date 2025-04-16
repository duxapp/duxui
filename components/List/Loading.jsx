import { Text, View } from '@tarojs/components'
import { Loading } from '@/duxapp'
import './Loading.scss'

export const ListLoading = ({ loading = true, text = '', flip }) => {

  return <View className={['list-loading', flip && 'list-loading--flip'].join(' ')}>
    {loading && <Loading size={46} />}
    <Text className='list-loading__text'>{text}</Text>
  </View>
}
