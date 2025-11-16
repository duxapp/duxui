import { Upload } from '../../../duxapp/utils/net'
import { GridProps } from '../Grid'

interface FileItem {
  name: string;
  size: number;
  url: string;
  icon: string;
  desc: string;
  media: string;
  progress?: number;
}

export declare const choiceUploadManage: (type?: string, max?: number) => Promise<FileItem[]>;

export declare const uploadManageDrive: {
  drive: any;
  getDreve(): any;
  setDreve(val: any): void;
};

// Export from drive/qiniu
interface QiniuConfig {
  token?: string;
  host?: string;
  endpoint?: string;
}

interface QiniuUploadOptions {
  filePath: string;
  progress?: (e: { progress: number; totalBytesSent: number; totalBytesExpectedToSend: number }) => void;
  cancelTask?: (abort: () => void) => void;
  getKey?: () => string;
  formData?: Record<string, any>;
}

interface QiniuUploadResult {
  url: string;
  key: string;
  [key: string]: any;
}

interface QiniuDrive {
  isReady(): boolean;
  configAsync(callback: () => Promise<QiniuConfig>): void;
  config(config: QiniuConfig): void;
  upload(options: QiniuUploadOptions): Promise<QiniuUploadResult>;
}

export declare const uploadDriveQiniu: () => QiniuDrive;

interface UploadManageProps extends GridProps {
  /**
   * 上传媒体类型
   * @example .jpg,.png
   * @example image/*,video/*
   * @example image/*,.mp4
   * @example .mp4,.mp3
   */
  type: string
  /**
   * 最多允许上传多少图片
   * 默认 1
   * 传入 1 相当于单个上传，value是字符串类型，大于1是多个上传，value是数组类型
   */
  max?: number
  /**
   * 值
   */
  value?: string | string[]
  /**
   * 操作值回调
   */
  onChange?: (value: string | string[]) => void
  /**
   * 默认值
   */
  defaultValue?: string | string[]
  /**
   * 每行显示多少图片
   * 默认4
   */
  column?: number
  /**
   * 添加图片文本
   * 默认 添加图片
   */
  addText?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 传递给上传函数的选项 */
  option?: Upload.Option
}

export const UploadManage: React.FC<UploadManageProps>
