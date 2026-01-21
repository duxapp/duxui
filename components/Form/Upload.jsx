import { View, Image, Video } from '@tarojs/components'
import { useCallback, useState } from 'react'
import { Loading, previewMedia, requestPermissionMessage } from '@/duxapp/components'
import classNames from 'classnames'
import { toast } from '@/duxapp'
import { duxappLang } from '@/duxapp/utils'
import { duxuiLang } from '@/duxui/utils'
import { formConfig } from './config'
import { DuxuiIcon } from '../DuxuiIcon'
import { Text } from '../Text'
import { Grid } from '../Grid'
import { Column } from '../Flex'
import { useFormItemProxy } from './Form'
import './Upload.scss'

export const UploadImages = ({
  value = [],
  column = 4,
  addText,
  onChange,
  type = 'image',
  max = 9,
  disabled,
  option,
  style,
  ...props
}) => {

  if (!value) {
    value = []
  }

  const t = duxuiLang.useT()
  const addTextValue = addText ?? t('upload.add')

  const del = useCallback((index) => {
    value.splice(index, 1)
    onChange([...value])
  }, [onChange, value])

  const [progress, setProgress] = useState(-1)

  const add = useCallback(async () => {
    const upload = formConfig.getUpload()
    try {
      if (process.env.TARO_ENV === 'rn') {
        await requestPermissionMessage(requestPermissionMessage.types.image)
      }
      const urls = await upload(type, { count: max - (value?.length || 0), sizeType: ['compressed'], ...option })
        .start(() => {
          setProgress(0)
        })
        .progress(setProgress)
      setProgress(-1)
      onChange([...value || [], ...urls])
    } catch (error) {
      console.log(error)
      if (error !== duxappLang.t('common.cancelSelect')) {
        toast(error?.message || error)
      }
      setProgress(-1)
    }
  }, [max, onChange, option, type, value])

  const isOne = max === 1

  const itemClass = classNames('UIUplod__item', isOne && 'UIUplod__item--one', isOne && props.className)

  const content = [
    ...value?.map((item, index) => {
      return <View
        {...isOne ? props : {}}
        style={isOne ? style : {}}
        className={itemClass}
        key={item}
      >
        <ItemView src={item} value={value} />
        {!disabled && <Column className='UIUplod__item__icon'>
          <DuxuiIcon name='close' className='text-danger text-s7' onClick={() => del(index)} />
        </Column>}
      </View>
    }),
    (value?.length || 0) < max && !disabled &&
    <Column
      key='add'
      grow={!isOne}
      justify='center'
      onClick={!~progress && add}
      style={isOne ? style : {}}
      {...isOne ? props : {}}
      className={itemClass}
    >
      {
        ~progress ?
          <>
            <Loading />
            <Text color={2} size={2}>{(progress * 100).toFixed(1)}%</Text>
          </> :
          <>
            <DuxuiIcon name='add-select' className='text-c2' size={addTextValue ? 48 : 64} />
            {!!addTextValue && <Text color={2} size={2}>{addTextValue}</Text>}
          </>
      }
    </Column>
  ]

  if (isOne) {
    return content
  }

  return <Grid column={column} square gap={24} {...props}>
    {content}
  </Grid>
}

const ItemView = ({
  src,
  value
}) => {

  const preview = useCallback(() => {
    let current = 0
    const sources = value.map((item, i) => {
      if (item === src) {
        current = i
      }
      if (isImage(item)) {
        return {
          url: item
        }
      }
      return {
        url: item,
        type: 'video'
      }
    })
    previewMedia({
      sources,
      current
    })
  }, [src, value])

  if (isImage(src)) {
    return <Image className='UIUplod__item__image w-full h-full'
      onClick={preview}
      src={src}
      mode='aspectFill'
    />
  } else {
    return <Column className='UIUplod__item__image w-full h-full'>
      <Video
        className='w-full h-full'
        src={src}
        controls={false}
        showCenterPlayBtn={false}
        showPlayBtn={false}
        showFullscreenBtn={false}
        enableProgressGesture={false}
        showBottomProgress={false}
        objectFit='cover'
      />
      <Column className='inset-0 absolute'
        onClick={preview}
      />
    </Column>
  }
}

const mediaImage = ['.jpg', '.png', '.gif', '.jpeg', '.webp']

const isImage = url => mediaImage.some(v => url?.split?.('?')[0].toLowerCase().endsWith(v))

export const UploadImage = ({ onChange, value, ...props }) => {

  return <UploadImages max={1} onChange={val => onChange(val[0])} value={value ? [value] : []}  {...props} />
}

export const Upload = ({
  max = 1,
  value,
  onChange,
  defaultValue,
  ...props
}) => {

  const [val, setVal] = useFormItemProxy({ value, onChange, defaultValue })

  if (max === 1) {
    return <UploadImage {...props} value={val} onChange={setVal} />
  }
  return <UploadImages max={max} {...props} value={val} onChange={setVal} />
}
