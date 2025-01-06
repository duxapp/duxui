import { useEffect, useMemo, useState, } from 'react'
import { ObjectManage, QuickEvent, toast } from '@/duxapp'
import { uploadManageDrive } from '../drive'
import { getExtIcon } from '../icons'

export * from './util'

class Queue {
  constructor(concurrency) {
    this.queue = []
    this.concurrency = concurrency
    this.runningCount = 0
  }

  enqueue(task) {
    this.queue.push(task)
    this.processQueue()
  }

  processQueue() {
    while (this.runningCount < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift()
      this.runningCount++
      task(() => {
        this.runningCount--
        this.processQueue()
      })
    }
  }
}

const uploadQueue = new Queue(1)

class UploadManage extends ObjectManage {

  constructor(props) {
    super(props)
  }

  config = {
    maxHistory: 60
  }

  data = {
    // 文件列表
    list: [],
    // 上传中的文件列表
    upload: []
  }

  /**
   * 正在上传资源列表
   */
  uploadList = []
  uploadListEvent = new QuickEvent()
  setUploadList = _data => {
    this.uploadList = _data
    this.uploadListEvent.trigger(_data)
  }

  /**
   * 设置上传配置
   * @param {*} param0
   */
  setConfig = ({
    maxHistory = 60
  }) => {
    this.config = {
      maxHistory
    }
  }

  static imageExt = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
  static videoExt = ['mp4', 'avi', 'wmv', '3gp', 'mov', 'm4v', 'asf', 'asx', 'rm', 'rmvb', 'mkv', 'flv', 'vob', 'dat']
  static audioExt = ['mp3', 'aac', 'wma', 'amr', 'flac', 'ape', 'ogg', 'midi', 'vqf']

  /**
   * 将传入的type转换为可识别的类型
   * @param {*} type image/*,.png,.jpg,.gif,.pdf
   * @returns
   */
  getTypes = type => {
    return type.split(',').map(item => {
      if (item.startsWith('.')) {
        return {
          type: 'ext',
          value: item.substring(1)
        }
      } else if (item.endsWith('/*')) {
        return {
          type: 'media',
          value: item.split('/')[0]
        }
      }
      return {
        type: 'unknown',
        value: ''
      }
    }).filter(v => v.type !== 'unknown')
  }

  /**
   * 大小转换
   * @param {*} size
   * @returns
   */
  getSize = size => {
    const sizes = ['KB', 'MB', 'GB', 'TB']
    size = size / 1024
    while (sizes.length) {
      if (size < 1024) {
        return size.toFixed(2) + sizes[0]
      }
      sizes.shift()
      size = size / 1024
    }
    return ''
  }

  /**
   * 判断是不是图片
   * @param {*} ext
   * @returns
   */
  isImage = ext => UploadManage.imageExt.includes(ext)
  /**
   * 判断是不是视频
   * @param {*} ext
   * @returns
   */
  isVideo = ext => UploadManage.videoExt.includes(ext)
  /**
   * 判断是不是音频
   * @param {*} ext
   * @returns
   */
  isAudio = ext => UploadManage.audioExt.includes(ext)

  /**
   * 获取列表
   * @param {*} type
   * @param {*} keyword
   * @returns
   */
  getList = (type = '', keyword = '') => {
    const types = this.getTypes(type)
    return this.data.list.filter(item => {
      const result = {
        type: true,
        keyword: true
      }
      if (type) {
        result.type = types.some(_type => {
          if (_type.type === 'ext') {
            return item.name.split('.').reverse()[0] === _type.value
          } else {
            return item.media.split('/')[0] === _type.value
          }
        })
      }
      if (keyword) {
        result.keyword = item.name.includes(keyword)
      }
      return result.type && result.keyword
    })
  }

  /**
   * 获取当前驱动
   * @returns
   */
  getDrive = () => uploadManageDrive.getDreve()

  // 上传选择之后的结果
  upload = async files => {
    const dreve = uploadManageDrive.getDreve()
    if (!dreve?.isReady()) {
      console.error('上传驱动未准备就绪 请检查设置')
    }
    const uploadList = files.map(item => {
      const ext = item.path.split('.').reverse()[0]
      const uploadItem = {
        progress: 0,
        path: item.path,
        size: item.size,
        name: item.name || item.path.split('/').reverse()[0],
        icon: this.isImage(ext) ? item.path : getExtIcon(ext),
        desc: this.getSize(item.size),
        media: this.isImage(ext) ? `image/${ext}` : this.isVideo(ext) ? `video/${ext}` : this.isAudio(ext) ? 'audio/${ext}' : `unknown/${ext}`
      }
      uploadQueue.enqueue(done => {
        setTimeout(() => {
          dreve.upload({
            filePath: item.path,
            progress: e => {
              uploadItem.progress = e.progress
              this.setUploadList([...this.uploadList])
            }
          }).then(res => {
            setTimeout(() => {
              this.uploadList.splice(this.uploadList.indexOf(uploadItem), 1)
              this.data.list.unshift({
                ...uploadItem,
                icon: this.isImage(ext) ? res.url : uploadItem.icon,
                url: res.url
              })
              this.setUploadList([...this.uploadList])
              if (this.data.list.length > this.config.maxHistory) {
                this.data.list.splice(this.config.maxHistory)
              }
              this.set({
                list: [...this.data.list]
              })
              done()
            }, 200)
          }).catch(err => {
            console.log('上传失败', err)
            toast(JSON.stringify(err))
            setTimeout(() => {
              this.uploadList.splice(this.uploadList.indexOf(uploadItem), 1)
              this.setUploadList([...this.uploadList])
              done()
            }, 200)
          })
        }, 0)
      })
      return uploadItem
    })
    this.setUploadList([
      ...this.uploadList,
      ...uploadList
    ])
  }

  useList = (type, keyword) => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const defaultList = useMemo(() => this.getList(type, keyword), [])

    const [list, setList] = useState(defaultList)

    useEffect(() => {
      const { remove } = this.onSet(() => {
        setList(this.getList(type, keyword))
      })
      setList(this.getList(type, keyword))
      return () => remove()
    }, [type, keyword])

    return list
  }

  useUploadList = () => {

    const [uploadList, setUploadList] = useState(this.uploadList)

    useEffect(() => {
      const { remove } = this.uploadListEvent.on(() => {
        setUploadList(this.uploadList)
      })
      return () => remove()
    }, [])

    return uploadList
  }
}

export const uploadManage = new UploadManage({
  cache: true,
  cacheKey: 'file-manage'
})
