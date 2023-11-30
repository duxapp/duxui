class FormConfig {
  config = {
    request: null,
    upload: null,
    uploadTempFile: null
  }

  getConfig = key => {
    if (key) {
      if(!this.config[key]) {
        throw `请使用 formConfig.setConfig 设置${key}函数`
      }
      return this.config[key]
    } else {
      return this.config
    }
  }

  getRequest = () => this.getConfig('request')

  getUpload = () => this.getConfig('upload')

  getUploadTempFile = () => this.getConfig('uploadTempFile')

  setConfig = _config => {
    Object.keys(_config).forEach(key => {
      this.config[key] = _config[key]
    })
  }
}

export const formConfig = new FormConfig()
