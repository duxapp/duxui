import { View, Image } from '@tarojs/components'
import { useCallback, useState } from 'react'
import { Loading } from '@/duxapp/components'
import classNames from 'classnames'
import { formConfig } from './config'
import { DuxuiIcon } from '../DuxuiIcon'
import { Text } from '../Text'
import { Grid } from '../Grid'
import { Column } from '../Flex'
import './Images.scss'

export const UploadImages = ({
  value,
  column = 4,
  addText = '添加图片',
  onChange,
  max = 9
}) => {

  const del = useCallback((index) => {
    value.splice(index, 1)
    onChange?.([...value])
  }, [onChange, value])

  const [progress, setProgress] = useState(-1)

  const add = useCallback(async () => {
    const upload = formConfig.getUpload()
    try {
      const urls = await upload('image', { count: max - (value?.length || 0), sizeType: ['compressed'] }).start(() => {
        setProgress(0)
      }).progress(setProgress)
      setProgress(-1)
      onChange?.([...value || [], ...urls])
    } catch (error) {
      setProgress(-1)
    }
  }, [max, onChange, value])

  const isOne = max === 1

  const content = [
    ...value?.map((item, index) => {
      return <View className={classNames('UIUplodImages__item', isOne && 'UIUplodImages__item--one')} key={item}>
        <Image className='UIUplodImages__item__image w-full h-full' src={item} mode='aspectFit' />
        <Column className='UIUplodImages__item__icon'>
          <DuxuiIcon name='close' color='red' size={36} onClick={() => del(index)} />
        </Column>
      </View>
    }),
    (value?.length || 0) < max &&
    <Column grow={!isOne} className={classNames('UIUplodImages__item', isOne && 'UIUplodImages__item--one')} justify='center' items='center' onClick={!~progress && add}>
      {
        ~progress ?
          <>
            <Loading />
            <Text color={2} size={2}>{(progress * 100).toFixed(1)}%</Text>
          </> :
          <>
            <Text color={2} size={48}><DuxuiIcon name='add-select' /></Text>
            <Text color={2} size={2}>{addText}</Text>
          </>
      }
    </Column>
  ]

  if (isOne) {
    return content
  }

  return <Grid column={column} square gap={24}>
    {content}
  </Grid>
}

UploadImages.defaultProps = {
  value: []
}

export const UploadImage = ({ onChange, value, addText }) => {

  return <UploadImages max={1} onChange={val => onChange(val[0])} value={value ? [value] : []} addText={addText} />
}
