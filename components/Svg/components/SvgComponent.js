import { Children, createContext, isValidElement, useContext, useEffect, useRef } from 'react'

const context = createContext({
  update: () => null
})

export const SvgComponent = ({ children }) => {

  const parent = useContext(context)

  const svgs = []

  const task = useRef(true)

  useEffect(() => {
    parent.update(svgs)
    if (task.current === true) {
      task.current = false
    }
  })

  return Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      return
    }
    const name = child.type.displayName

    if (!name || !name.startsWith('DuxSvg')) {
      return <context.Provider
        value={{
          update: svg => {
            svgs[index] = svg
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
      svgs[index] = child
    }
  })
}

SvgComponent.Provider = context.Provider
