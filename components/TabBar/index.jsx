import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import React, { useMemo, useState, useCallback, createContext, useContext, useEffect, useRef } from 'react'
import { QuickEvent, useRoute, currentPage, route } from '@/duxapp'
import classNames from 'classnames'
import { Badge } from '../Badge'
import './index.scss'

const usePageShow = () => {
  const [show, setShow] = useState(true)
  useDidShow(() => setShow(true))
  useDidHide(() => setShow(false))
  return show
}

const screenContext = createContext({
  hover: false,
  index: -1
})

const tabbarContext = createContext({
  show: false
})

const TabbarScreen = ({
  hover,
  index,
  children: child
}) => {

  const [render, setRender] = useState(false)

  useMemo(() => {
    if (hover && !render) {
      setRender(true)
    }
  }, [hover, render])

  return <screenContext.Provider value={{ hover, index }}>
    <View className={classNames('TabBar-page__item', hover && 'TabBar-page__item--hover')}>
      {
        render && (React.isValidElement(child.Comp)
          ? React.cloneElement(child.Comp, { _index: child.index, _key: child.itemKey })
          : <child.Comp _index={child.index} _key={child.itemKey} />)
      }
    </View>
  </screenContext.Provider>
}

const TabbarButton = ({
  text,
  number,
  select,
  hover,
  index,
  onClick,
  icon: Icon
}) => {

  const itemClick = useCallback(() => {
    onClick({ index })
  }, [index, onClick])

  return <View className='TabBar-menu__item' onClick={itemClick}>
    <Badge count={number > 0 ? number : 0} dot={number < 0}>
      {
        React.isValidElement(Icon)
          ? Icon
          : <Icon hover={hover} index={index} select={select} />
      }
      {!!text && <Text className={`TabBar-menu__item__name${hover ? ' TabBar-menu__item__name--hover' : ''}`}>{text}</Text>}
    </Badge>
  </View>
}

const Item = ({
  name,
  component,
  icon,
  itemKey
}) => {
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
  actionEvent
}) => {

  const { path } = useRoute()

  // 红点数量
  const [numbers, setNumbers] = useState({})

  const childs = useMemo(() => {
    return React.Children.map(children, ({ props }, index) => {
      const Comp = props.component
      return {
        child: {
          Comp,
          index,
          itemKey: props.itemKey
        },
        key: props.itemKey,
        index,
        name: props.name,
        icon: props.icon
      }
    })
  }, [children])

  const [select, setSelect] = useState(0)

  useEffect(() => {
    onChange?.(select)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [select])

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
    const { remove } = actionEvent.on((key, ...value) => {
      if (key === 'switch') {
        // 切换
        itemClick({ index: value[0] })
        // 如果不在Tabbar页面，跳转到当前页面
        if (currentPage() !== path) {
          const pages = Taro.getCurrentPages()
          const index = pages.findIndex(page => {
            const pagePath = page.route.startsWith('/') ? page.route.substring(1) : page.route
            if (pagePath === path) {
              return true
            }
          })
          route.back(pages.length - index)
        }
      } else if (key === 'setNumber') {
        // 设置红点数量
        setNumbers(old => ({ ...old, [value[0]]: value[1] }))
      }
    })
    return () => remove()
  }, [actionEvent, itemClick, path])

  const show = usePageShow()

  return <tabbarContext.Provider value={{ show }}>
    {
      childs.map((item, index) => <TabbarScreen key={item.key || index} hover={select === index} index={index}>
        {item.child}
      </TabbarScreen>)
    }
    <View
      style={style}
      className={classNames('TabBar-menu', className)}
    >
      {
        childs.map((item, index) => <TabbarButton
          icon={item.icon}
          number={numbers[index]}
          text={item.text}
          key={index}
          select={select}
          hover={index === select}
          length={childs.length}
          index={index}
          onClick={itemClick}
        />)
      }
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

    const _TabBar = ({
      children,
      onChange,
      style,
      className
    }) => {
      return <TabBar
        tabbarKey={key}
        beforeEvent={beforeEvent}
        afterEvent={afterEvent}
        actionEvent={actionEvent}
        onChange={onChange}
        style={style}
        className={className}
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

    _TabBar.onSwitchBefore = beforeEvent.on

    _TabBar.onSwitchAfter = afterEvent.on

    _TabBar.setNumber = (index, number) => {
      actionEvent.trigger('setNumber', index, number)
    }

    _TabBar.useShow = useShow

    _TabBar.useHide = useHide

    _TabBar.useShowStatus = useShowStatus

    return _TabBar
  }
})()
