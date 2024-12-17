import React, { useCallback, useEffect, useMemo, useRef, useImperativeHandle, forwardRef } from 'react'
import { Canvas } from '@tarojs/components'
import { getSystemInfoSync, createSelectorQuery, canvasToTempFilePath } from '@tarojs/taro'

let id = 0

export const Svg = forwardRef(({ children, width = 300, height = 300 }, ref) => {
  const canvasRef = useRef({
    defs: {}
  }).current

  const canvasId = useMemo(() => `ui-svg-${++id}`, [])

  const reload = useRef({
    timer: null
  })

  useImperativeHandle(ref, () => {
    return {
      canvasToTempFilePath: option => canvasToTempFilePath({
        canvas: canvasRef.canvas,
        ...option
      })
    }
  })

  const draw = useCallback(() => {
    React.Children.forEach(children, child => {

      const beforeData = child.type.drawBefore?.(child.props, canvasRef)

      const props = {
        beforeData
      }

      for (const key in child.props) {
        if (Object.prototype.hasOwnProperty.call(child.props, key)) {
          let val = child.props[key]
          if (typeof val === 'string' && val.startsWith('url(#')) {
            const def = val.slice(5, val.length - 1)
            if (canvasRef.defs[def]) {
              val = canvasRef.defs[def](child.type?.bbox?.(child.props, canvasRef, beforeData))
            } else {
              val = ''
            }
          }
          props[key] = val
        }
      }

      const res = child?.type?.draw?.(canvasRef.ctx, props, canvasRef)

      if (res) {
        if (res.wait) {
          res.wait.then(() => {
            if (!reload.current.timer) {
              reload.current.timer = setTimeout(() => {
                reload.current.timer = null
                draw()
              }, 0)
            }
          })
        }
        if (res.stop) {
          // 停止递归
        }
      }
    })
  }, [canvasRef, children])

  useEffect(() => {
    if (!canvasRef.ctx) {
      const query = createSelectorQuery()
      query.select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec((_res) => {
          const canvas = _res[0].node
          const ctx = canvas.getContext('2d')

          if (process.env.TARO_ENV !== 'h5') {
            const dpr = getSystemInfoSync().pixelRatio
            canvas.width = _res[0].width * dpr
            canvas.height = _res[0].height * dpr
            ctx.scale(dpr, dpr)
          }

          canvasRef.ctx = ctx
          canvasRef.canvas = canvas

          draw()
        })
    } else {
      draw()
    }
  }, [canvasId, canvasRef, draw])

  return <Canvas
    canvasId={canvasId}
    id={canvasId}
    type='2d'
    style={{ width, height }}
  />
})

Svg.name = 'Svg'
