import { View, Image, Video } from '@tarojs/components'
import { useCallback } from 'react'
import { previewMedia } from '@/duxapp/components'
import classNames from 'classnames'
import { duxuiLang } from '@/duxui/utils'
import { DuxuiIcon } from '../DuxuiIcon'
import { Text } from '../Text'
import { Grid } from '../Grid'
import { Column } from '../Flex'
import { useFormItemProxy } from '../Form'
import { choiceUploadManage } from './UploadManage'
import { UploadManage as UploadManageUtil } from './utils'
import { getExtIcon } from './icons'
import '../Form/Upload.scss'

const Uploads = ({
  value = [],
  column = 4,
  addText,
  onChange,
  type = 'image/*',
  max = 9,
  disabled,
  style,
  option,
  ...props
}) => {

  if (!value) {
    value = []
  }

  const t = duxuiLang.useT()
  const addTextValue = addText ?? t('common.select')

  const del = useCallback((index) => {
    value.splice(index, 1)
    onChange([...value])
  }, [onChange, value])

  const add = useCallback(async () => {
    try {
      const urls = await choiceUploadManage(type, max, option)
      onChange([...value || [], ...urls.map(v => v.url)])
    } catch (error) {
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
          <DuxuiIcon name='close' color='red' size={36} onClick={() => del(index)} />
        </Column>}
      </View>
    }),
    (value?.length || 0) < max && !disabled &&
    <Column
      key='add'
      grow={!isOne}
      justify='center'
      onClick={add}
      style={isOne ? style : {}}
      {...isOne ? props : {}}
      className={itemClass}
    >
      <DuxuiIcon name='add-select' className='text-c2' size={addTextValue ? 48 : 64} />
      {!!addTextValue && <Text color={2} size={2}>{addTextValue}</Text>}
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
      if (isType('image', item)) {
        return {
          url: item
        }
      } else if (isType('video', item)) {
        return {
          url: item,
          type: 'video'
        }
      }
    }).filter(v => v)
    previewMedia({
      sources,
      current
    })
  }, [src, value])

  if (isType('image', src)) {
    return <Image className='UIUplod__item__image w-full h-full'
      onClick={preview}
      src={src}
      mode='aspectFill'
    />
  } else if (isType('video', src)) {
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
  } else {
    return <Image className='UIUplod__item__image w-full h-full'
      src={getExtIcon(getExt(src))}
    />
  }
}

const getExt = url => {
  const splits = url.split('?')[0].split('.')
  return splits[splits.length - 1].toLowerCase()
}

const isType = (type, url) => {
  return UploadManageUtil.exts[type].includes(getExt(url))
}

const Upload = ({ onChange, value, ...props }) => {
  return <Uploads max={1} onChange={val => onChange(val[0])} value={value ? [value] : []}  {...props} />
}

export const UploadManage = ({
  max = 1,
  value,
  onChange,
  defaultValue,
  ...props
}) => {

  const [val, setVal] = useFormItemProxy({ value, onChange, defaultValue })

  if (max === 1) {
    return <Upload {...props} value={val} onChange={setVal} />
  }
  return <Uploads max={max} {...props} value={val} onChange={setVal} />
}
