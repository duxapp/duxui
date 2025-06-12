import { useEffect, useMemo, useImperativeHandle, forwardRef, useCallback } from 'react'
import { Canvas } from '@tarojs/components'
import { createSelectorQuery, canvasToTempFilePath } from '@tarojs/taro'
import { draw, pure, useForwardEvent } from './Common'
import { SvgComponent } from './SvgComponent'
import { getWindowInfo } from '@/duxapp'

export const Svg = /*@__PURE__*/ pure(() => {
  const Svg_ = forwardRef(({ children, width, height, viewBox, preserveAspectRatio, ...props }, ref) => {

    const context = useMemo(() => {
      const data = {
        svgs: [],
        defs: {},
        layout: {
          width,
          height,
          viewBox,
          preserveAspectRatio
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
          } else if (item.onLayout) {
            const layout = item.onLayout
            const value = layout.value()
            const newLayout = value?.nativeEvent.layout
            if (layout.el.svgContext) {
              const elLayout = layout.el.svgContext.layout
              if (value && (!elLayout || elLayout.x !== newLayout.x || elLayout.y !== newLayout.y || elLayout.width !== newLayout.width || elLayout.height !== newLayout.height)) {
                layout.callback(value)
              }
              layout.el.svgContext.layout = newLayout
            }
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

    // viewBox
    context.layout.viewBox = viewBox
    context.layout.preserveAspectRatio = preserveAspectRatio

    const canvasId = useMemo(() => {
      if (!Svg.svgId) {
        Svg.svgId = 0
      }
      return `ui-svg-${++Svg.svgId}`
    }, [])

    useImperativeHandle(ref, () => {
      return {
        canvasToTempFilePath: option => canvasToTempFilePath({
          canvas: context.canvas,
          ...option
        })
      }
    })

    useEffect(() => {
      createSelectorQuery()
        .select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec((_res) => {
          const canvas = _res[0].node
          const ctx = canvas.getContext('2d')

          if (process.env.TARO_ENV !== 'h5') {
            const dpr = getWindowInfo().pixelRatio
            canvas.width = _res[0].width * dpr
            canvas.height = _res[0].height * dpr
            ctx.scale(dpr, dpr)

            // 重新赋值宽高，兼容百分比写法
            context.layout.width = _res[0].width
            context.layout.height = _res[0].height
          } else {
            context.layout.width = _res[0].node.offsetWidth
            context.layout.height = _res[0].node.offsetHeight
          }

          context.ctx = ctx
          context.canvas = canvas

          context.reload(draw(context))
        })
    }, [canvasId, context, width, height])

    const update = useCallback(svgs => {
      context.svgs = svgs.flat(Infinity)
      context.reload(draw(context))
    }, [context])

    const event = useForwardEvent(context, props)

    return <>
      <Canvas
        canvasId={canvasId}
        id={canvasId}
        type='2d'
        style={{ width, height }}
        {...event.handlers}
      />
      <SvgComponent value={{ update }}>
        {children}
      </SvgComponent>
    </>
  })

  Svg_.displayName = 'DuxSvg'

  return Svg_
})
