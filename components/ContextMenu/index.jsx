import { Animated, colorDark, colorLighten, duxappTheme, getWindowInfo, nextTick, px, pxNum, theme, TopView, transformStyle } from '@/duxapp'
import { ScrollView, View } from '@tarojs/components'
import { useEffect, useMemo, useState } from 'react'
import { duxuiLang } from '@/duxui/utils'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'

export const showContextMenu = ({
  x, y, list, animation, oneCallback
}) => {
  if (!list?.length) {
    return Promise.reject(duxuiLang.t('contextMenu.emptyList'))
  }
  if (list.length === 1 && oneCallback) {
    return Promise.resolve({
      index: 0,
      item: list[0]
    })
  }
  if (typeof x !== 'number' || typeof y !== 'number') {
    return Promise.reject(duxuiLang.t('contextMenu.invalidCoord'))
  }

  const select = () => {
    return new Promise((resolve, reject) => {
      const { remove } = TopView.add([
        ContextMenu,
        {
          x, y, list, animation,
          onClose: () => {
            remove()
            reject(duxuiLang.t('contextMenu.cancelSelect'))
          },
          onSelect: data => {
            remove()
            if (data.item.children?.length) {
              animation = false
              list = data.item.children
              select().then(resolve).catch(reject)
            } else {
              resolve(data)
            }
          }
        }
      ])
    })
  }

  return select()
}

const ContextMenu = ({ x, y, list, animation = true, onClose, onSelect }) => {

  const itemSize = 48

  const [an, setAn] = useState(Animated.defaultState)

  const { transformOrigin, transform, top, height } = useMemo(() => {
    const info = getWindowInfo()
    const menuHeight = list.length * itemSize
    const maxHeight = info.windowHeight * 0.95
    const displayHeight = Math.min(menuHeight, maxHeight)

    // 计算水平位置和变换
    let translateX = '0%'
    if (x > info.windowWidth / 2) {
      translateX = '-100%'
    }

    // 计算垂直位置，尽量保证菜单完全出现在屏幕内
    let _top = y
    let originY = '0%' // 默认从上方向下展开

    if (y + displayHeight <= info.windowHeight) {
      // 下侧空间足够，正常放在下侧，但如果高度过大仍然可能超出底部，做一次兜底修正
      const bottom = y + displayHeight
      if (bottom > info.windowHeight) {
        _top = Math.max(0, info.windowHeight - displayHeight)
      }
    } else {
      // 下侧不够，尝试放到上侧
      const aboveTop = y - displayHeight
      if (aboveTop >= 0) {
        // 上侧空间足够，直接贴在上侧
        _top = aboveTop
        originY = '100%' // 从下方向上展开
      } else {
        // 上下都放不下完整菜单：顶端对齐屏幕顶部
        _top = 0
      }
    }

    return {
      transformOrigin: `${translateX === '0%' ? '0%' : '100%'} ${originY}`,
      transform: { translateX },
      top: _top,
      height: displayHeight
    }
  }, [x, y, list.length, itemSize])

  useEffect(() => {
    // 初始化动画
    if (!animation) {
      return
    }
    nextTick(() => {
      setAn(Animated.create({
        duration: 80,
        transformOrigin
      })
        .scale(1)
        .opacity(1)
        .step()
        .export())
    })
  }, [transform.translateX, transformOrigin, animation])

  return (
    <>
      <View
        className='absolute inset-0'
        onClick={onClose}
        style={{ zIndex: 10 }}
      />
      <View
        className='absolute z-2'
        style={{
          zIndex: 10,
          left: x,
          top,
          transform: transformStyle(transform)
        }}
      >
        <Animated.View
          animation={an}
          className='bg-white r-1 overflow-hidden'
          style={{
            boxShadow: `0 0 ${pxNum(10)}px 0 ${theme.isDark()
              ? colorLighten(duxappTheme.whiteColor, 0.1)
              : colorDark(duxappTheme.whiteColor, 0.1)
              }`,
            opacity: animation ? 0 : 1,
            transform: transformStyle({
              scaleX: animation ? 0 : 1,
              scaleY: animation ? 0 : 1
            }),
            transformOrigin,
            height
          }}
        >
          <ScrollView
            scrollY
            style={{ height }}
          >
            {list.map((item, index) => (
              <View
                key={index}
                className='flex-row ph-3 z-2 gap-1 justify-between items-center'
                style={{
                  height: itemSize,
                  minWidth: px(120)
                }}
                onClick={() => {
                  onSelect({ item, index })
                }}
              >
                <Text nowrap {...item?.props}>{item?.name || item}</Text>
                {!!item.children?.length && <DuxuiIcon name='direction_right' className='text-s3 text-c1' />}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </>
  )
}
