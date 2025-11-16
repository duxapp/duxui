import { View, Image, Text } from '@tarojs/components'
import { useMemo, useRef, useState, useCallback, useReducer } from 'react'
import { chooseMessageFile } from '@tarojs/taro'
import { getWindowInfo, stopPropagation, toast } from '@/duxapp/utils'
import { ScrollView, PullView, TopView, chooseMedia } from '@/duxapp'
import { UploadManage } from './utils'
import './UploadManage.scss'
import { showContextMenu } from '../ContextMenu'
import { Empty } from '../Empty'
import { DuxuiIcon } from '../DuxuiIcon'
import { confirmForm } from '../ConfirmForm'
import { Input } from '../Form'
import { Row } from '../Flex'
import { confirm } from '../Interact'

export const choiceUploadManage = (type, max, option) => {
  const types = type
    ? UploadManage.getTypes(type).reduce((prev, current) => {
      let media = 'file'
      if (current.type === 'ext') {
        if (UploadManage.isImage(current.value)) {
          media = 'image'
        } else if (UploadManage.isVideo(current.value)) {
          media = 'video'
        }
        prev.extension.push(current.value)
      } else {
        media = current.value
        const exts = UploadManage.exts[media]
        if (exts) {
          prev.extension.push(...exts)
        }
      }

      if (media === 'image') {
        prev.image = true
      } else if (media === 'video') {
        prev.video = true
      } else {
        prev.file = true
      }
      return prev
    }, { image: false, video: false, file: false, extension: [] })
    : { image: true, video: true, file: true }

  return new Promise((resolve, reject) => {
    const { remove } = TopView.add([
      UploadManageView,
      {
        type,
        max,
        types,
        option,
        onSubmit: data => {
          remove()
          resolve(data)
        },
        onClose: () => {
          remove()
          reject()
        }
      }
    ])
  })
}

export const UploadManageView = ({ max, type, types, option, onClose, onSubmit }) => {

  const pull = useRef()

  const uploadManage = UploadManage.getInstance()

  const list = uploadManage.useList(type)

  const [selects, setSelects] = useState([])

  const menuList = useMemo(() => {
    const _list = []
    if (types.image) {
      _list.push({
        name: '图片',
        callback: () => {
          chooseMedia('image', {
            count: 9,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            ...option
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
        name: '视频',
        callback: () => {
          chooseMedia('video', {
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            ...option
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
      //   name: '文件',
      //   callback: () => {

      //   }
      // })
    }
    if (process.env.TARO_ENV === 'weapp') {
      if (types.image && types.video && types.file) {
        _list.push({
          name: '从聊天中选择',
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
            name: '聊天中的图片',
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
            name: '聊天中的视频',
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
            name: '聊天中的文件',
            callback: () => {
              chooseMessageFile({
                count: 10,
                type: 'file',
                extension: types.extension
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const select = useCallback(async item => {
    if (max > 1) {
      setSelects(old => {
        const index = old.indexOf(item)
        if (~index) {
          old.splice(index, 1)
        } else {
          if (old.length >= max) {
            toast('最多选择' + max + '项')
            return old
          }
          old.push(item)
        }
        return [...old]
      })
    } else {
      await pull.current.close(false)
      onSubmit([item])
    }
  }, [max, onSubmit])

  const submit = useCallback(async () => {
    if (!selects.length) {
      return toast('请至少选择一项')
    }
    await pull.current.close(false)
    onSubmit(selects)
  }, [onSubmit, selects])

  const upload = <Row className='border-w1 border-primary r-1 pv-1 ph-2 gap-1'
    onClick={async e => {
      const touch = e.changedTouches[0]
      const { item } = await showContextMenu({
        x: touch.pageX,
        y: touch.pageY,
        list: menuList,
        oneCallback: true
      })
      item.callback()
    }}
  >
    <DuxuiIcon name='shangchuan' className='text-s4 text-primary' />
    <Text className='text-s3 text-primary'>上传</Text>
  </Row>

  return <PullView ref={pull} onClose={onClose}>
    <View className='file-upload rt-3 bg-page'
      style={{ height: getWindowInfo().windowHeight - 180 }}
    >
      <View className='file-upload__header'>
        {upload}
        {max > 1 && <Row className='border-w1 border-primary r-1 pv-1 ph-2 gap-1' onClick={submit}>
          <DuxuiIcon name='shangchuan' className='text-s4 text-primary' />
          <Text className='text-s3 text-primary'>上传</Text>
        </Row>}
      </View>
      <ScrollView>
        <UploadList />
        {
          list.map((item, index) => <Item key={item.url} index={index} select={max > 1} isSelect={selects.includes(item)} onSelect={select} item={item} />)
        }
        {!list.length && <Empty title='暂无资源 点击上传开始' renderFooter={upload} />}
      </ScrollView>
    </View>
  </PullView>
}

const UploadList = () => {
  const list = UploadManage.getInstance().useUploadList()
  return <>
    {
      list.map(item => <Item key={item.path} item={item} uploading />)
    }
  </>
}

const Item = ({ item, index, uploading, isSelect, select, onSelect }) => {

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const click = useCallback(() => {
    onSelect?.(item)
  }, [item, onSelect])

  return <View onClick={click} className='file-upload__item'>
    {select && <View className='file-upload__item__select'>
      {isSelect && <View className='file-upload__item__select__child' />}
    </View>}
    <Image src={item.icon} className='file-upload__item__img' />
    <View className='file-upload__item__info'>
      <Row className='items-center gap-1'>
        <Text className='file-upload__item__name flex-grow'>{item.name}</Text>
        {!uploading && <>
          <DuxuiIcon name='bianji'
            className='text-s7 text-c1'
            onClick={async e => {
              stopPropagation(e)
              const res = getFileInfo(item.name)
              const val = await confirmForm({
                title: '修改名称',
                defaultValue: res.name,
                form: <Input placeholder='文件名' align='center' focus />
              })
              if (!val) {
                return
              }
              item.name = `${val}.${res.ext}`
              const uploadManage = UploadManage.getInstance()
              uploadManage.merge({
                list: uploadManage.data.list
              })
              forceUpdate()
            }}
          />
          <DuxuiIcon name='close'
            className='text-danger'
            size={48}
            onClick={async e => {
              stopPropagation(e)
              if (!await confirm({
                content: '是否删除这个资源？'
              })) {
                return
              }
              const uploadManage = UploadManage.getInstance()
              uploadManage.data.list.splice(index, 1)
              uploadManage.merge({
                list: [...uploadManage.data.list]
              })
            }}
          />
        </>}
      </Row>
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

function getFileInfo(filename) {
  const lastDotIndex = filename.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return {
      name: filename,
      ext: ''
    }
  }

  return {
    name: filename.slice(0, lastDotIndex),
    ext: filename.slice(lastDotIndex + 1)
  }
}
