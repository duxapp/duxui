import { Upload, Request } from '@/duxapp'

interface Config {
  request?: Request.functions['request']
  upload?: Upload.functions['upload']
  uploadTempFile?: Upload.functions['uploadTempFile']
}

function getConfigValue(key: keyof Config): undefined {
  switch (key) {
    case 'request':
      return Config.request;
    case 'upload':
      return Config.upload;
    case 'uploadTempFile':
      return Config.uploadTempFile;
    default:
      return undefined;
  }
}

declare class FormConfig {
  /**
   * 获取配置
   */
  getConfig: (key: keyof Config) => Config[keyof Config] | undefined
  /** 获取请求函数 */
  getRequest: () => Config['request']
  /** 获取上传函数 */
  getUpload: () => Config['upload']
  /** 获取上传临时文件函数 */
  getUploadTempFile: () => Config['uploadTempFile']
  /**
   * 注册请求和上传函数 提供给 图片上传和签名组件使用
   */
  setConfig: (config: Config) => void
}

declare const formConfig: FormConfig;

export { formConfig };
