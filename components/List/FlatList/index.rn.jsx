import { FlashList } from '@shopify/flash-list'

export const FlatList = ({ refresh, onScrollToLower, onRefresh, ...props }) => {

  return <FlashList
    refreshing={refresh}
    onRefresh={onRefresh}
    onEndReached={onScrollToLower}
    onEndReachedThreshold={0.2}
    estimatedItemSize={100}
    {...props}
  />
}
