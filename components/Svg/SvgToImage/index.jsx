import { cloneElement, forwardRef, isValidElement, useImperativeHandle, useRef } from 'react'

export const SvgToImage = forwardRef(({ children, option = {} }, ref) => {

  const svg = useRef()

  useImperativeHandle(ref, () => {
    return {
      capture: async () => {
        const res = await svg.current.canvasToTempFilePath({
          fileType: option.format ?? 'png',
          quality: option.quality ?? 1
        })

        return res
      }
    }
  })

  if (isValidElement(children) && children.type.displayName === 'DuxSvg') {
    return cloneElement(children, {
      ref: svg
    })
  }

  throw new Error('SvgToImage 的子元素只能是 Svg')
})
