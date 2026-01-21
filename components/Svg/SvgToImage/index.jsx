import { cloneElement, forwardRef, isValidElement, useImperativeHandle, useRef } from 'react'
import { duxuiLang } from '@/duxui/utils'

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

  throw new Error(duxuiLang.t('svg.svgToImageOnlySvg'))
})
