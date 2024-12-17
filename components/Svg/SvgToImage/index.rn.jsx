import { forwardRef, useImperativeHandle, useRef } from 'react'
import ViewShot from 'react-native-view-shot'

export const SvgToImage = forwardRef((props, ref) => {

  const viewShot = useRef()

  useImperativeHandle(ref, () => {
    return {
      capture: () => viewShot.current.capture().then(uri => {
        return {
          tempFilePath: uri
        }
      })
    }
  }, [])

  return <ViewShot {...props} ref={ref} />
})
