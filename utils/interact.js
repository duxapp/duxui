import { TopView, currentPage } from '@/duxapp'
import { ShowConfirm, ShowMessage, ShowLoading } from '@/duxui/components/Interact'

/**
 * 在页面上显示一个loading 当页面被关闭是loading也会随着关闭
 * @param {string} text loading文字
 * @param {boolean} mask 是否显示遮罩
 * @returns
 */
export const loading = (() => {
  const pages = {}
  return (text, mask) => {
    const page = currentPage()
    if (!pages[page]) {
      pages[page] = TopView.add([ShowLoading, { text, mask }])
    } else {
      pages[page].update([ShowLoading, { text, mask }])
    }
    return () => {
      /**
       * bug 停止的时候有时候找不到数据
       */
      pages[page]?.remove?.()
      delete pages[page]
    }
  }
})();

/**
 * 在页面上显示一个提示框
 * @returns
 */
export const confirm = ({
  title = '提示',
  content,
  cancel,
  cancelText,
  confirmText,
  renderTop,
  renderBottom
} = {}) => {
  let action
  let callback = []
  const promise = new Promise((resolve, reject) => {
    callback = [resolve, reject]
    action = TopView.add([
      ShowConfirm,
      {
        title,
        content,
        cancel,
        cancelText,
        confirmText,
        renderTop,
        renderBottom,
        onCancel: () => {
          setTimeout(() => {
            resolve(false)
          }, 10)
          action.remove()
        },
        onConfirm: () => {
          setTimeout(() => {
            resolve(true)
          }, 10)
          action.remove()
        },
        onClose: () => {
          setTimeout(() => {
            reject('confirm:组件被卸载')
          }, 10)
          action.remove()
        }
      }
    ])
  })

  promise.confirm = () => {
    callback[0](true)
    action.remove()
  }
  promise.cancel = () => {
    callback[0](false)
    action.remove()
  }
  promise.close = () => {
    callback[1]()
    action.remove('confirm:主动关闭')
  }
  return promise
}


/**
 * 在页面顶部显示一个提示消息，三秒后或者页面跳转时将会自动关闭
 * @param {string} title 提示标题
 * @param {string} content 提示详情
 * @param {string} url 点击跳转链接
 * @returns
 */
export const message = (() => {
  const pages = {}
  return (title, content, url) => {

    if (!title) {
      return console.log('message: 请传入标题')
    }

    const onClose = () => {
      pages[page].remove()
      delete pages[page]
    }

    const page = currentPage()
    if (!pages[page]) {
      pages[page] = TopView.add([ShowMessage, { title, content, url }])
    } else {
      pages[page].update([ShowMessage, { title, content, url }])
    }

    return onClose
  }
})();
