import { useEffect, useMemo, useImperativeHandle, forwardRef, useCallback } from 'react'
import { Canvas, View } from '@tarojs/components'
import { CustomWrapper } from '@/duxapp'
import { getSystemInfoSync, createSelectorQuery, canvasToTempFilePath } from '@tarojs/taro'
import { draw, useForwardEvent } from './Common'
import { SvgComponent } from './SvgComponent'

let id = 0

export const Svg = forwardRef(({ children, width, height, ...props }, ref) => {

  const context = useMemo(() => {
    const data = {
      svgs: [],
      defs: {},
      layout: {
        width,
        height
      }
    }

    // 异步加载的数据重新渲染
    let reloadTimer
    const reload = res => {
      res.forEach(item => {
        if (item?.wait) {
          item.wait.then(() => {
            if (!reloadTimer) {
              reloadTimer = setTimeout(() => {
                reloadTimer = null
                reload(draw(data))
              }, 0)
            }
          })
        }
      })
    }
    data.reload = reload

    // 动画更新重新渲染
    let changeStatus = null
    const change = () => {
      if (!changeStatus) {
        const requestAnimationFrame = data.canvas.requestAnimationFrame || window.requestAnimationFrame
        changeStatus = requestAnimationFrame(() => {
          changeStatus = null
          reload(draw(data))
        })
      }
    }
    const anmap = new Map()
    data.addAnimated = animated => {
      if (!anmap.has(animated)) {
        anmap.set(animated, animated.addListener(change))
      }
    }

    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  context.layout = {
    width,
    height
  }

  const [canvasId, _id] = useMemo(() => [`ui-svg-${++id}`, id], [])

  useImperativeHandle(ref, () => {
    return {
      canvasToTempFilePath: option => canvasToTempFilePath({
        canvas: context.canvas,
        ...option
      })
    }
  })

  useEffect(() => {
    if (!context.ctx) {
      createSelectorQuery()
        .in(document.getElementById(`CustomWrapper-${_id}`)?.ctx)
        .select(`#${canvasId}`)
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

          context.ctx = ctx
          context.canvas = canvas

          context.reload(draw(context))
        })
    }
  }, [canvasId, context, _id])

  const update = useCallback(svgs => {
    context.svgs = svgs.flat(Infinity)
    context.reload(draw(context))
  }, [context])

  const event = useForwardEvent(context, props)

  return <CustomWrapper id={_id}>
    <View
      {...event.handlers}
      style={{ width, height }}
    >
      <Canvas
        canvasId={canvasId}
        id={canvasId}
        type='2d'
        style={{ width, height }}
      />
    </View>
    <SvgComponent.Provider
      value={{ update }}
    >
      <SvgComponent>
        {children}
      </SvgComponent>
    </SvgComponent.Provider>
  </CustomWrapper>
})

Svg.displayName = 'DuxSvg'

