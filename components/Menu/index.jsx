import { useCallback, useState, createContext, useContext, useRef, forwardRef, useImperativeHandle, useMemo, useEffect } from 'react'
import { Layout, Absolute, duxappTheme, Animated, nextTick, pxNum, asyncTimeOut, transformStyle, px } from '@/duxapp'
import classNames from 'classnames'
import { getSystemInfoSync } from '@tarojs/taro'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import { DuxuiIcon } from '../DuxuiIcon'
import { Grid } from '../Grid'
import { formContext, useFormContext } from '../Form'
import './index.scss'

const menuContext = createContext({
  itemClick: () => void 0,
  onIndex: () => void 0,
  onSetClick: () => void 0
})

const MenuItem = (() => {
  let key = 0
  return forwardRef(({
    title,
    options,
    cancel,
    checkbox,
    column = 1,
    align,
    value,
    onChange,
    children,
    onClick,
    className,
    renderIcon,
    ...props
  }, ref) => {

    const { itemClick, showIndex, onIndex, onSetClick, pull } = useContext(menuContext)

    const index = useMemo(() => {
      const k = key++
      onIndex(k)
      return k
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const click = async e => {
      if (onClick) {
        // 通知关闭打开的菜单
        pull && itemClick({
          close: true,
          index
        })
        !pull && onClick(e)
        return
      }
      try {
        const item = await itemClick({
          options,
          column,
          align,
          value,
          index,
          children
        })
        if (checkbox) {
          // fix 多选模式暂未开发
        } else {
          onChange?.(item.value === value && cancel ? void 0 : item.value)
        }
      } catch (error) {

      }
    }

    !pull && onSetClick(index, click)

    useImperativeHandle(ref, () => {
      return {
        toggle: click
      }
    })

    const isOpen = showIndex === index

    const type = isOpen ? 'primary' : void 0

    const label = children ? title : (options?.find(v => v.value === value)?.name || title)

    return <Row className={classNames('MenuItem', className)} grow items='center' justify='center' {...props} onClick={click}>
      <Text type={type} numberOfLines={1}>{label}</Text>
      {renderIcon || <DuxuiIcon
        color={isOpen ? duxappTheme.primaryColor : duxappTheme.textColor1}
        size={32}
        name={isOpen ? 'direction_up-fill' : 'direction-down_fill'}
      />}
    </Row>
  })
})()

export const Menu = ({
  round,
  children,
  className,
  style,
  ...props
}) => {

  const [show, setShow] = useState(-1)
  const [layout, setLayout] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  })

  const [reloadKey, setReloadKey] = useState(0)

  // 记录原始索引和弹出后重新渲染的索引
  const indexs = useRef({
    show: [],
    pull: []
  })

  /**
   * 记录子元素的点击事件，当处于弹出环境时，转发点击事件到子元素
   */
  const itemClicks = useRef({})

  // 调用内部方法关闭弹窗
  const pullContent = useRef()

  const [pullIndexs, setPullIndexs] = useState([])

  const callback = useRef([])
  const option = useRef(null)
  const itemClick = useCallback(async _option => {
    callback.current[1]?.('点击了其他菜单')
    if (_option.close) {
      await pullContent.current.close()
      setShow(-1)
      option.current = null
      // 出发子元素菜单的这个点击事件
      const index = indexs.current.pull.indexOf(_option.index)
      itemClicks.current[indexs.current.show[index]]?.()
      return
    }
    // 判断是从弹出后点击
    const pullIndex = indexs.current.pull.indexOf(_option.index)
    if (~pullIndex) {
      _option.index = indexs.current.show[pullIndex]
    }
    if (option.current?.index === _option.index) {
      await pullContent.current.close()
      setShow(-1)
      option.current = null
      return Promise.reject('关闭菜单')
    }
    return new Promise((resolve, reject) => {
      callback.current = [resolve, reject]
      option.current = _option
      setReloadKey(old => old + 1)
    })
  }, [])

  const onLayout = useCallback(data => {
    if (option.current) {
      setLayout(data)
      setShow(option.current.index)
    }
  }, [])

  const valueClick = useCallback(async item => {
    await pullContent.current.close(true)
    callback.current[0](item)
    callback.current = []
    option.current = null
    setShow(-1)
  }, [])

  const close = useCallback(() => {
    callback.current[1]('关闭了菜单')
    callback.current = []
    option.current = null
    setShow(-1)
  }, [])

  const onIndex = useCallback(index => {
    indexs.current.show.push(index)
  }, [])

  const pullIndex = useCallback(index => {
    if (indexs.current.show.length === indexs.current.pull.length) {
      indexs.current.pull = []
    }
    indexs.current.pull.push(index)

    // 数据收集完成后用 state状态管理，使界面重新刷新，否则渲染有问题
    if (indexs.current.pull.length === indexs.current.show.length) {
      setPullIndexs(indexs.current.pull)
    }
  }, [])

  const onSetClick = useCallback((index, click) => {
    itemClicks.current[index] = click
  }, [])

  // 转发Form的上下文，让表单生效
  const form = useFormContext()

  return <>
    <Layout className={classNames('Menu flex-row items-center', className)} style={style} {...props} reloadKey={reloadKey} onLayout={onLayout}>
      <menuContext.Provider value={{ itemClick, showIndex: show, onIndex, onSetClick }}>
        {children}
      </menuContext.Provider>
    </Layout>
    {
      !!~show && <PullContent
        ref={pullContent}
        option={option}
        layout={layout}
        className={className}
        form={form}
        itemClick={itemClick}
        valueClick={valueClick}
        show={show}
        indexs={indexs}
        pullIndexs={pullIndexs}
        pullIndex={pullIndex}
        round={round}
        onClose={close}
      >{children}</PullContent>
    }
  </>
}

const duration = 100

const PullContent = forwardRef(({
  option,
  layout,
  className,
  form,
  itemClick,
  valueClick,
  show,
  indexs,
  pullIndexs,
  pullIndex,
  children,
  round,
  onClose
}, ref) => {

  const [mainAn, setMainAn] = useState(Animated.defaultState)

  const [maskAn, setMaskAn] = useState(Animated.defaultState)

  const ans = useRef()

  const refs = useRef({})
  refs.current.onClose = onClose

  const close = useCallback(async (noOnClose) => {
    let an = ans.current.main
    setMainAn(an.translateY(pxNum(-100)).opacity(0).step().export())
    setMaskAn(ans.current.mask.opacity(0).step().export())
    await asyncTimeOut(duration)
    noOnClose !== true && refs.current.onClose?.()
  }, [])

  useEffect(() => {
    nextTick(() => {
      if (!ans.current) {
        ans.current = {
          main: Animated.create({
            duration,
            timingFunction: 'ease-in-out'
          }),
          mask: Animated.create({
            duration,
            timingFunction: 'ease-in-out'
          })
        }
      }
      setMainAn(ans.current.main.translateY(0).opacity(1).step().export())
      setMaskAn(ans.current.mask.opacity(0.5).step().export())
    })
  }, [])

  useImperativeHandle(ref, () => {
    return {
      close
    }
  })

  const screenHeight = getSystemInfoSync().screenHeight

  return <Absolute>
    <Column
      className='absolute left-0 top-0 w-full items-center'
      style={{ height: layout.top + layout.height }}
      onClick={close}
    />
    <Animated.View
      animation={maskAn}
      className='Menu__mask absolute left-0 bottom-0 w-full items-center'
      style={{ height: screenHeight - (layout.top + layout.height) }}
    />
    <Column
      className='Menu__mask absolute left-0 bottom-0 w-full items-center'
      style={{ height: screenHeight - (layout.top + layout.height) }}
      onClick={close}
    />
    <Animated.View
      animation={mainAn}
      className={classNames('Menu__content absolute', round && 'Menu__content--round')}
      style={{
        top: layout.height + layout.top,
        left: layout.left,
        width: layout.width,
        transform: transformStyle({
          translateY: px(-100)
        })
      }}
    >
      {
        option.current.children ||
        <Grid column={option.current.column} gap={36} className='self-stretch'>
          {
            option.current.options.map(item => <Text
              align={option.current.align}
              key={item.value}
              type={item.value === option.current.value ? 'primary' : void 0}
              onClick={() => valueClick(item)}
            >{item.name}</Text>)
          }
        </Grid>
      }
    </Animated.View>

    <Row className={classNames('Menu absolute', className)}
      items='center'
      style={{
        top: layout.top,
        left: layout.left,
        width: layout.width,
        height: layout.height
      }}
    >
      <formContext.Provider value={form}>
        <menuContext.Provider
          value={{
            itemClick,
            showIndex: ~show ? pullIndexs[indexs.current.show.indexOf(show)] : show,
            onIndex: pullIndex,
            pull: true
          }}
        >
          {children}
        </menuContext.Provider>
      </formContext.Provider>
    </Row>
  </Absolute>
})

Menu.Item = MenuItem
