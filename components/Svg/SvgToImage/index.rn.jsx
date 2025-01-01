import { forwardRef, useImperativeHandle, useRef } from 'react'
import ViewShot from 'react-native-view-shot'

export const SvgToImage = forwardRef((props, ref) => {

  const viewShot = useRef()

  useImperativeHandle(ref, () => {
    return {
      capture: async () => {
        const uri = await viewShot.current.capture()
        return {
          tempFilePath: uri
        }
      }
    }
  }, [])

  return <ViewShot {...props} ref={viewShot} />
})
