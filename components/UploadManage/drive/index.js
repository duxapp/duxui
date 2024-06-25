import { userConfig } from '@/duxapp'

export const uploadManageDrive = {
  drive: null,
  getDreve() {
    return this.drive || userConfig.option?.duxui?.uploadManage?.drive
  },
  setDreve(val) {
    this.drive = val
  }
}
