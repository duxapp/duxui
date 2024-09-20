import { View, Image, Text } from '@tarojs/components'
import { useMemo, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { chooseMessageFile } from '@tarojs/taro'
import { toast } from '@/duxapp/utils'
import { getMedia } from '@/duxapp/utils/net/util'
import { ScrollView, PullView } from '@/duxapp'
import { uploadManage } from './utils'
import { DropDown } from '../DropDown'
import './UploadManage.scss'

const Item = ({ item, uploading, isSelect, select, onSelect }) => {

  const click = useCallback(() => {
    onSelect?.(item)
  }, [item, onSelect])

  return <View onClick={click} className='file-upload__item'>
    {select && <View className='file-upload__item__select'>
      {isSelect && <View className='file-upload__item__select__child' />}
    </View>}
    <Image src={item.icon} className='file-upload__item__img' />
    <View className='file-upload__item__info'>
      <Text className='file-upload__item__name'>{item.name}</Text>
      {
        uploading
          ? <View className='file-upload__item__uploading'>
            <View className='file-upload__item__uploading__child' style={{ width: item.progress + '%' }} />
          </View>
          : <Text className='file-upload__item__desc'>{item.desc}</Text>
      }
    </View>
  </View>
}

const UploadList = () => {
  const list = uploadManage.useUploadList()
  return <>
    {
      list.map(item => <Item key={item.path} item={item} uploading />)
    }
  </>
}

export const UploadManage = forwardRef(({ }, ref) => {

  const [show, setShow] = useState(false)

  const [type, setType] = useState('')

  const list = uploadManage.useList(type)

  const [types, setTypes] = useState({ image: false, video: false, file: false })

  const [selects, setSelects] = useState([])

  const close = useCallback(() => {
    setShow(false)
    callback.current[1]?.()
  }, [])

  const [max, setMax] = useState(9)

  const callback = useRef([])

  useImperativeHandle(ref, () => ({
    select: (_type, _max = 9) => {
      setMax(_max)
      setSelects([])
      const uploadTypes = _type
        ? uploadManage.getTypes(_type).reduce((prev, current) => {
          let media = 'file'
          if (current.type === 'ext') {
            if (uploadManage.isImage(current.value)) {
              media = 'image'
            } else if (uploadManage.isVideo(current.value)) {
              media = 'video'
            }
          } else {
            media = current.value
          }
          if (media === 'image' && !prev.image) {
            prev.image = true
          } else if (media === 'video' && !prev.video) {
            prev.video = true
          } else if (!prev.file) {
            prev.file = true
          }
          return prev
        }, { image: false, video: false, file: false })
        : { image: true, video: true, file: true }
      setType(_type)
      setTypes(uploadTypes)
      setShow(true)
      return new Promise((resolve, reject) => {
        callback.current = [resolve, reject]
      })
    }
  }), [])

  const menuList = useMemo(() => {
    const _list = []
    if (types.image) {
      _list.push({
        text: '图片',
        callback: () => {
          getMedia('image', {
            count: 9,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera']
          }).then(res => {
            uploadManage.upload(res.map(item => ({
              path: item.path,
              size: item.size
            })))
          })
        }
      })
    }
    if (types.video) {
      _list.push({
        text: '视频',
        callback: () => {
          getMedia('video', {
            sourceType: ['album', 'camera'],
            maxDuration: 60,
          }).then(res => {
            uploadManage.upload(res.map(item => ({
              path: item.path,
              size: item.size
            })))
          })
        }
      })
    }
    if (types.file && process.env.TARO_ENV !== 'weapp') {
      // _list.push({
      //   text: '文件',
      //   callback: () => {

      //   }
      // })
    }
    if (process.env.TARO_ENV === 'weapp') {
      if (types.image && types.video && types.file) {
        _list.push({
          text: '从消息中选择',
          callback: () => {
            chooseMessageFile({
              count: 10,
              type: 'all',
            }).then(res => {
              uploadManage.upload(res.tempFiles.map(item => ({
                path: item.path,
                size: item.size,
                name: item.name
              })))
            })
          }
        })
      } else {
        if (types.image) {
          _list.push({
            text: '消息图片',
            callback: () => {
              chooseMessageFile({
                count: 10,
                type: 'image',
              }).then(res => {
                uploadManage.upload(res.tempFiles.map(item => ({
                  path: item.path,
                  size: item.size,
                  name: item.name
                })))
              })
            }
          })
        }
        if (types.video) {
          _list.push({
            text: '消息视频',
            callback: () => {
              chooseMessageFile({
                count: 10,
                type: 'video',
              }).then(res => {
                uploadManage.upload(res.tempFiles.map(item => ({
                  path: item.path,
                  size: item.size,
                  name: item.name
                })))
              })
            }
          })
        }
        if (types.file) {
          _list.push({
            text: '消息文件',
            callback: () => {
              chooseMessageFile({
                count: 10,
                type: 'file'
              }).then(res => {
                uploadManage.upload(res.tempFiles.map(item => ({
                  path: item.path,
                  size: item.size,
                  name: item.name
                })))
              })
            }
          })
        }
      }
    }
    return _list
  }, [types])

  const upload = useCallback(e => {
    e.item.callback()
  }, [])

  const select = useCallback(item => {
    if (max > 1) {
      setSelects(old => {
        const index = old.indexOf(item)
        if (~index) {
          old.splice(index, 1)
        } else {
          if (old.length >= max) {
            toast('最多选择' + old + '项')
            return old
          }
          old.push(item)
        }
        return [...old]
      })
    } else {
      setShow(false)
      callback.current[0]?.([item])
    }
  }, [max])

  const submit = useCallback(() => {
    if (!selects.length) {
      return toast('请至少选择一项')
    }
    setShow(false)
    callback.current[0]?.(selects)
  }, [selects])

  return show && <PullView onClose={close}>
    <View className='file-upload'>
      <View className='file-upload__header'>
        {/* <View className='file-upload__header__search'>
          <Input placeholder='搜索' />
        </View> */}
        <DropDown menuList={menuList} onSelect={upload}>
          <Text className='file-upload__header__upload'>上传</Text>
        </DropDown>
        {max > 1 && <Text className='file-upload__header__submit' onClick={submit}>确定</Text>}
      </View>
      <ScrollView>
        <UploadList />
        {
          list.map(item => <Item key={item.url} select={max > 1} isSelect={selects.includes(item)} onSelect={select} item={item} />)
        }
      </ScrollView>
    </View>
  </PullView>
})
