import { FlashList } from '@shopify/flash-list'

export const FlatList = ({ refresh, onScrollToLower, ...props }) => {

  return <FlashList
    refreshing={refresh}
    onEndReached={onScrollToLower}
    onEndReachedThreshold={0.2}
    estimatedItemSize={100}
    {...props}
  />
}
