import { Children, createContext, isValidElement, useContext, useEffect, useRef, Fragment } from 'react'

const context = /*@__PURE__*/ createContext({
  update: () => null
})

/**
 * bug 临时决绝方案，无法给react组件赋值的问题
 */
if (process.env.TARO_ENV === 'h5') {
  Object.freeze = function (data) {
    return data
  }
}

export const SvgComponent = ({ children, value }) => {

  let parent = useContext(context)

  if (value) {
    parent = value
  }

  const svgs = []

  const task = useRef(true)

  const childContext = useRef(new Map()).current
  const currentContext = new Set()

  useEffect(() => {
    parent.update(svgs)
    if (task.current === true) {
      task.current = false
    }
  })

  const childRes = []

  const getResult = (list = children, indexs = [], callback) => Children.map(list, (child, index) => {
    if (!isValidElement(child)) {
      return
    }

    const keys = [...indexs, index]

    // 为当前元素赋值一个context
    const componentName = child.type?.name || child.type?.displayName || ''

    const key = `${child.key !== null ? child.key : keys.join('-')}-${componentName}`

    childContext.set(key, childContext.get(key) ?? {})

    child.svgContext = childContext.get(key)

    currentContext.add(key)

    const name = child.type.displayName

    if (child.type === Fragment) {
      childRes.push(getResult(child.props.children, keys))
    } else if (!name || !name.startsWith('DuxSvg')) {
      return <context.Provider
        value={{
          update: svg => {
            recursionSetValue(keys, svgs, svg)
            if (!task.current) {
              task.current = Promise.resolve().then(() => {
                task.current = null
                parent.update(svgs)
              })
            }
          }
        }}
      >
        {child}
      </context.Provider>
    } else {
      // if (child.props.children) {
      //   getResult(child.props.children, keys, _svgs => {
      //     child.props.children = _svgs
      //   })
      // }
      recursionSetValue(keys, svgs, child)
    }
  })

  const res = getResult()
  res.push(childRes)

  // 移除空的contenxt
  childContext.forEach((_value, key) => {
    if (!currentContext.has(key)) {
      childContext.delete(key)
    }
  })

  return res
}

export const SvgComponentProvider = context.Provider

const recursionSetValue = (keys, arr, value) => {
  if (keys.length === 1) {
    arr[keys[0]] = value
  } else if (keys.length > 1) {
    if (!arr[keys[0]]) {
      arr[keys[0]] = []
    }
    recursionSetValue(keys.slice(1), arr[keys[0]], value)
  }
}
