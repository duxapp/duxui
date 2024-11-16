import { uploadFile as uploadFileTaro } from '@tarojs/taro'
import md5 from 'crypto-js/md5'
import { Platform } from '@/duxapp/utils/rn/util'

const uploadFile = process.env.TARO_ENV === 'rn'
  ? (() => {
    const isAndroid = Platform.OS === 'android'
    const createFormData = (filePath, body = {}, name) => {
      const data = new FormData()
      const uri = isAndroid ? filePath : filePath.replace('file://', '');
      const fileObj = { uri: uri, type: 'application/octet-stream', name: uri.substr(uri.lastIndexOf('/') + 1) || 'file' }
      Object.keys(body).forEach(key => {
        data.append(key, body[key])
      })
      data.append(name, fileObj)
      return data
    }

    return opts => {
      const { url, timeout = 60000 * 10, filePath, name, header, formData } = opts
      const xhr = new XMLHttpRequest()
      const execFetch = new Promise((resolve, reject) => {
        xhr.open('POST', url)
        xhr.responseType = 'text'
        // 上传进度
        xhr.upload.onprogress = e => {
          progressFunc?.({
            progress: e.lengthComputable ? e.loaded / e.total * 100 : 0,
            totalBytesSent: e.loaded,
            totalBytesExpectedToSend: e.total
          })
        }
        // 请求头
        const headers = {
          'Content-Type': 'multipart/form-data',
          ...header,
        }
        for (const key in headers) {
          if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key])
          }
        }
        // 请求成功
        xhr.onload = () => {
          clearTimeout(timer)
          if (xhr.status === 200) {
            resolve({
              data: xhr.response,
              errMsg: 'ok',
              statusCode: 200
            })
          } else {
            reject({ errMsg: 'uploadFile fail: ' + xhr.responseText })
          }
        }
        // 请求失败
        xhr.onerror = e => {
          clearTimeout(timer)
          reject({ errMsg: 'uploadFile fail: ' + e.type })
        }
        xhr.send(createFormData(filePath, formData, name))

        const timer = setTimeout(() => {
          xhr.abort()
          reject({ errMsg: 'uploadFile fail: 请求超时' })
        }, timeout)
      })
      let progressFunc
      execFetch.progress = func => {
        progressFunc = func
        return execFetch
      }
      // 取消上传
      execFetch.abort = () => {
        xhr.abort()
        return execFetch
      }
      return execFetch
    }
  })()
  : uploadFileTaro

export default (() => {

  /**
   * 配置
   */
  const config = {
    token: '',
    // 区域上传域名
    endpoint: '',
    // 图片访问域名
    host: '',
    // 异步获取配置
    syncCallback: null,
  }

  const setConfig = ({ token, host, endpoint }) => {
    if (token) {
      config.token = token
    }
    if (host) {
      config.host = host
    }
    if (endpoint) {
      config.endpoint = endpoint
    }
  }

  const initToken = async () => {
    if (config.token) {
      return
    }
    if (!config.syncCallback) {
      throw '请注册获取配置的异步函数'
    }
    const _config = await config.syncCallback()
    setConfig(_config)
  }

  const isReady = () => (!!config.token && !!config.endpoint && !!config.host) || !!config.syncCallback

  return () => {
    return {
      isReady,
      configSync: callback => {
        config.syncCallback = callback
      },
      config: setConfig,
      upload: async ({
        filePath,
        progress,
        cancelTask,
        getKey,
        formData
      }) => {
        await initToken()
        if (!isReady()) {
          console.error('七牛云上传参数错误 请配置参数后重试')
          throw '七牛云上传参数错误 请配置参数后重试'
        }

        // qiniuShouldUseQiniuFileName 如果是 true，则文件的 key 由 qiniu 服务器分配（全局去重）。如果是 false，则文件的 key 使用微信自动生成的 filename。出于初代sdk用户升级后兼容问题的考虑，默认是 false。
        const uploadTask = uploadFile({
          url: config.endpoint,
          filePath,
          name: 'file',
          formData: {
            ...formData,
            token: config.token,
            key: getKey?.() || md5(new Date().getTime() + '') + '.' + filePath.split('.').reverse()[0]
          }
        })

        // 文件上传进度
        uploadTask.progress(progress)

        // 中断文件上传
        cancelTask && cancelTask(() => {
          uploadTask.abort()
        })

        try {
          const res_1 = await uploadTask
          const dataString = res_1.data
          const dataObject = JSON.parse(dataString)

          if (res_1.statusCode !== 200) {
            throw dataObject
          }
          dataObject.url = config.host + '/' + dataObject.key
          return dataObject
        } catch (e) {
          console.log('上传错误: ', e)
          throw e
        }
      }
    }
  }
})()
