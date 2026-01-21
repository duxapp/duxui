import { View, Text, Image } from '@tarojs/components'
import { getCurrentPages } from '@tarojs/taro'
import React, { useState, useCallback, createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { Animated, QuickEvent, currentPage, getBottomSafeAreaHeight, pxNum, route, transformStyle, useDeepObject, usePageShow } from '@/duxapp'
import classNames from 'classnames'
import { Badge } from '../Badge'
import './index.scss'

const screenContext = /*@__PURE__*/ createContext({
  hover: false,
  index: -1
})

const tabbarContext = /*@__PURE__*/ createContext({
  show: false
})

const TabbarScreen = ({
  select,
  index,
  child
}) => {

  const render = useRef()

  if (select && !render.current) {
    render.current = true
  }

  if (!render.current) {
    return
  }

  return <screenContext.Provider value={{ hover: select, index }}>
    <View
      className={classNames(
        'TabBar-page__item',
        select && 'TabBar-page__item--hover'
      )}
    >
      {
        render.current && (React.isValidElement(child.Comp)
          ? React.cloneElement(child.Comp, { _index: child.index, _key: child.itemKey })
          : <child.Comp _index={child.index} _key={child.itemKey} />)
      }
    </View>
  </screenContext.Provider>
}

const TabbarButton = ({
  name,
  number,
  select,
  hover,
  index,
  onClick,
  icon: Icon
}) => {

  return <View
    className={classNames(
      'TabBar-menu__item',
      Icon ? 'pv-2' : 'pv-3'
    )}
    onClick={() => onClick({ index })}
  >
    <Badge count={number > 0 ? number : 0} dot={number < 0}>
      {
        !Icon ? null : React.isValidElement(Icon)
          ? Icon
          : <Icon hover={hover} index={index} select={select} />
      }
      {!!name && <Text
        className={classNames(
          `TabBar-menu__item__name`,
          hover && ' TabBar-menu__item__name--hover',
          !Icon ? 'bold text-s7' : 'text-s1 mt-1'
        )}
      >{name}</Text>}
    </Badge>
  </View>
}

const TabBarMenus = ({
  style,
  className,
  floating,
  position,
  childs,
  select,
  itemClick,
  actionEvent
}) => {

  const bottomSafeAreaHeight = position === 'left' ? 0 : getBottomSafeAreaHeight()

  // 红点数量
  const [numbers, setNumbers] = useState({})
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const { remove } = actionEvent.on((key, ...value) => {
      if (key === 'setNumber') {
        setNumbers(old => ({ ...old, [value[0]]: value[1] }))
      } else if (key === 'setVisible') {
        setVisible(!!value[0])
      }
    })
    return () => remove()
  }, [actionEvent])

  const firstRenderRef = useRef(true)

  const hiddenTransform = useMemo(() => {
    return transformStyle(position === 'left'
      ? { translateX: -240 }
      : { translateY: 240 })
  }, [position])

  const [menuAn, setMenuAn] = useState(Animated.defaultState)

  useEffect(() => {
    const duration = firstRenderRef.current ? 0 : 300
    firstRenderRef.current = false

    const an = Animated.create({
      duration,
      timingFunction: 'ease-in-out'
    })

    if (position === 'left') {
      an.translateX(visible ? 0 : -240)
    } else {
      an.translateY(visible ? 0 : 240)
    }

    setMenuAn(an.opacity(visible ? 1 : 0).step().export())
  }, [position, visible])

  const safeAreaPaddingBottom = !floating && position !== 'left' ? bottomSafeAreaHeight : 0

  const baseStyle = (style && typeof style === 'object' && !Array.isArray(style)) ? style : {}
  const menuStyle = !visible
    ? {
      ...baseStyle,
      ...(safeAreaPaddingBottom > 0 ? { paddingBottom: safeAreaPaddingBottom } : {}),
      opacity: 0,
      transform: hiddenTransform
    }
    : {
      ...baseStyle,
      ...(safeAreaPaddingBottom > 0 ? { paddingBottom: safeAreaPaddingBottom } : {}),
    }

  const menus = (
    <Animated.View
      key='tabbar-menus'
      style={menuStyle}
      animation={menuAn}
      className={classNames(
        'TabBar-menu',
        position === 'left' && 'TabBar-menu--left',
        floating && 'TabBar-menu--floating shadow',
        floating && position === 'left' && 'TabBar-menu--floating-left',
        className
      )}
    >
      {
        childs.map((item, index) => <TabbarButton
          icon={item.icon}
          number={numbers[index]}
          name={item.name}
          key={index}
          select={select}
          hover={index === select}
          length={childs.length}
          index={index}
          onClick={itemClick}
          floating={floating}
        />)
      }
    </Animated.View>
  )

  return floating ? (
    <View
      className={classNames(
        'TabBar-menu__wrap',
        position === 'left' ? 'TabBar-menu__wrap--floating-left' : 'TabBar-menu__wrap--floating'
      )}
      style={{
        transform: transformStyle(position === 'left'
          ? { translateY: '-50%' }
          : { translateX: '-50%' }),
        ...(position === 'left' ? {} : { bottom: pxNum(16) + bottomSafeAreaHeight })
      }}
    >
      {menus}
    </View>
  ) : (
    menus
  )
}

const Item = () => {
  return null
}

const ItemIcon = ({
  hover,
  name,
  image,
  imageHover,
  icon
}) => {
  return <View className='TabBar-menu__icon'>
    {
      icon || <Image className='TabBar-menu__icon__image' src={hover ? imageHover : image} />
    }
    {!!name && <Text className={classNames('TabBar-menu__icon__name', hover && 'TabBar-menu__icon__name--hover')}>{name}</Text>}
  </View>
}

const TabBar = ({
  onChange,
  style,
  className,
  children,
  beforeEvent,
  afterEvent,
  actionEvent,
  floating = false,
  position = 'bottom',
  defaultIndex = 0
}) => {

  const { path } = route.useRoute()

  const childs = useDeepObject(
    React.Children.toArray(children)
      .filter(React.isValidElement)
      .map(({ props }, index) => ({
        child: {
          Comp: props.component,
          index,
          itemKey: props.itemKey
        },
        key: props.itemKey,
        index,
        name: props.name,
        icon: props.icon
      }))
  )

  const clampIndex = useCallback(index => {
    const max = Math.max((childs?.length || 1) - 1, 0)
    const next = Number(index)
    if (!Number.isFinite(next)) {
      return 0
    }
    return Math.min(Math.max(next, 0), max)
  }, [childs?.length])

  const [select, setSelect] = useState(() => clampIndex(defaultIndex))

  useEffect(() => {
    onChange?.(select)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [select])

  useEffect(() => {
    setSelect(clampIndex(defaultIndex))
  }, [clampIndex, defaultIndex])

  const itemClick = useCallback(async ({ index }) => {
    for (let i = 0; i < beforeEvent.callbacks.length; i++) {
      await beforeEvent.callbacks[i]({ index })
    }
    setSelect(index)
    for (let i = 0; i < afterEvent.callbacks.length; i++) {
      afterEvent.callbacks[i]({ index })
    }
  }, [afterEvent.callbacks, beforeEvent.callbacks])

  useEffect(() => {
    const { remove } = actionEvent.on(async (key, ...value) => {
      if (key === 'switch') {
        // 切换
        itemClick({ index: value[0] })
        // 如果不在Tabbar页面，跳转到当前页面
        if (currentPage() !== path) {
          const pages = getCurrentPages()
          const index = pages.findIndex(page => {
            const pagePath = page.route.startsWith('/') ? page.route.substring(1) : page.route
            if (pagePath === path) {
              return true
            }
          })
          route.back(pages.length - index - 1)
        }
      }
    })
    return () => remove()
  }, [actionEvent, itemClick, path])

  const show = usePageShow()

  const menusNode = <TabBarMenus
    style={style}
    className={className}
    floating={floating}
    position={position}
    childs={childs}
    select={select}
    itemClick={itemClick}
    actionEvent={actionEvent}
  />

  const pagesNode = (
    <View className='TabBar-page'>
      {
        childs.map((item, index) => <TabbarScreen
          key={item.key || index}
          select={select === index}
          index={index}
          child={item.child}
        />)
      }
    </View>
  )

  return <tabbarContext.Provider value={{ show }}>
    <View
      className={classNames(
        'TabBar',
        `TabBar--${position}`,
        floating && 'TabBar--floating'
      )}
    >
      {position === 'left' ? menusNode : pagesNode}
      {position === 'left' ? pagesNode : menusNode}
    </View>
  </tabbarContext.Provider>
}

export const createTabBar = (() => {
  let _key = 0
  return () => {

    const key = _key++

    const beforeEvent = new QuickEvent()
    const afterEvent = new QuickEvent()

    const actionEvent = new QuickEvent()
    let visible = true

    const _TabBar = ({
      children,
      style,
      ...props
    }) => {
      return <TabBar
        tabbarKey={key}
        beforeEvent={beforeEvent}
        afterEvent={afterEvent}
        actionEvent={actionEvent}
        style={style}
        {...props}
      >
        {children}
      </TabBar>
    }

    const useShow = callback => {

      const callbackRef = useRef(callback)
      callbackRef.current = callback

      const { show } = useContext(tabbarContext)
      const { hover } = useContext(screenContext)

      useEffect(() => {
        if (show && hover) {
          callbackRef.current?.()
        }
      }, [show, hover])
    }

    const useHide = callback => {
      const callbackRef = useRef(callback)
      callbackRef.current = callback

      const { show } = useContext(tabbarContext)
      const { hover } = useContext(screenContext)

      useEffect(() => {
        if (!show || !hover) {
          callbackRef.current?.()
        }
      }, [show, hover])
    }

    const useShowStatus = () => {

      const { show } = useContext(tabbarContext)
      const { hover } = useContext(screenContext)

      return show && hover
    }

    _TabBar.Item = Item

    _TabBar.ItemIcon = ItemIcon

    _TabBar.key = key

    _TabBar.switch = index => {
      actionEvent.trigger('switch', index)
    }

    _TabBar.setVisible = next => {
      visible = !!next
      actionEvent.trigger('setVisible', visible)
    }

    _TabBar.onSwitchBefore = beforeEvent.on

    _TabBar.onSwitchAfter = afterEvent.on

    _TabBar.setNumber = (index, number) => {
      actionEvent.trigger('setNumber', index, number)
    }

    _TabBar.useShow = useShow

    _TabBar.useHide = useHide

    _TabBar.useShowStatus = useShowStatus

    Object.defineProperty(_TabBar, 'visible', {
      enumerable: true,
      configurable: false,
      get: () => visible
    })

    return _TabBar
  }
})()
