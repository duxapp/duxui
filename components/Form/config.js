class FormConfig {
  config = {
    request: null,
    upload: null,
    uploadTempFile: null
  }

  getConfig = key => {
    if (key) {
      return this.config[key]
    } else {
      return this.config
    }
  }

  setConfig = _config => {
    Object.keys(_config).forEach(key => {
      this.config[key] = _config[key]
    })
  }
}

export const formConfig = new FormConfig()
