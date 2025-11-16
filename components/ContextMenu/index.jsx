import { Animated, colorDark, colorLighten, duxappTheme, getWindowInfo, nextTick, pxNum, theme, TopView, transformStyle } from '@/duxapp'
import { View } from '@tarojs/components'
import { useEffect, useMemo, useState } from 'react'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'

export const showContextMenu = ({
  x, y, list, animation, oneCallback
}) => {
  if (!list?.length) {
    return Promise.reject('菜单列表为空')
  }
  if (list.length === 1 && oneCallback) {
    return Promise.resolve({
      index: 0,
      item: list[0]
    })
  }
  if (typeof x !== 'number' || typeof y !== 'number') {
    return Promise.reject('坐标参数错误')
  }

  const select = () => {
    return new Promise((resolve, reject) => {
      const { remove } = TopView.add([
        ContextMenu,
        {
          x, y, list, animation,
          onClose: () => {
            remove()
            reject('取消选择')
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

  const { transformOrigin, transform, top } = useMemo(() => {
    const info = getWindowInfo()
    const menuHeight = list.length * itemSize

    // 计算水平位置和变换
    let translateX = '0%'
    if (x > info.windowWidth / 2) {
      translateX = '-100%'
    }

    // 计算垂直位置，尽量保证菜单完全出现在屏幕内
    let _top = y
    let originY = '0%' // 默认从上方向下展开

    if (y + menuHeight <= info.windowHeight) {
      // 下侧空间足够，正常放在下侧，但如果高度过大仍然可能超出底部，做一次兜底修正
      const bottom = y + menuHeight
      if (bottom > info.windowHeight) {
        _top = Math.max(0, info.windowHeight - menuHeight)
      }
    } else {
      // 下侧不够，尝试放到上侧
      const aboveTop = y - menuHeight
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
      top: _top
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
      <Column
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
            transformOrigin
          }}
        >
          {list.map((item, index) => (
            <Row
              key={index}
              className='ph-3 z-2 gap-1 justify-between items-center'
              style={{
                height: itemSize,
                borderBottom: index < list.length - 1
                  ? `1px solid ${duxappTheme.borderColor}`
                  : 'none',
                minWidth: pxNum(120)
              }}
              onClick={() => {
                onSelect({ item, index })
              }}
            >
              <Text nowrap>{item?.name || item}</Text>
              {!!item.children?.length && <DuxuiIcon name='direction_right' className='text-s3 text-c1' />}
            </Row>
          ))}
        </Animated.View>
      </Column>
    </>
  )
}
