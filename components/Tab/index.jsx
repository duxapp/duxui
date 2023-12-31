import { useState, useCallback, useMemo, Children, useRef } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { ScrollView, Layout } from '@/duxapp'
import { Absolute } from '../Absolute'
import { Text } from '../Text'
import { Column, Row } from '../Flex'
import { DuxuiIcon } from '../DuxuiIcon'
import { BoxShadow } from '../BoxShadow'
import { Space } from '../Space'
import './index.scss'

const TabItem = ({
  type,
  buttonColor,
  buttonRound,
  title,
  paneKey,
  select,
  onClick,
  isExpand,
  scroll
}) => {

  if (type === 'button') {
    return <Column
      self='center'
      className={classNames(
        'Tab__item--button',
        buttonColor && 'Tab__item--button-c-' + buttonColor,
        buttonRound && 'Tab__item--button-round',
        select && 'Tab__item--button-select',
        isExpand && 'Tab__item--button-expand',
      )}
      onClick={() => onClick(paneKey)}
    >
      <Text color={select ? 4 : 1} size={4}>{title}</Text>
    </Column>
  }

  return <Column
    self='center'
    className={scroll && 'Tab__item'}
    items='center'
    justify='center'
    onClick={() => onClick(paneKey)}
  >
    <Text type={select ? 'primary' : void 0} color={select ? void 0 : 2} bold size={4}>{title}</Text>
    <View className={classNames('Tab__item__line', select && 'Tab__item__line--hover')} />
  </Column>
}

const Scroll = ({
  scroll,
  style,
  children
}) => {
  if (scroll) {
    return <ScrollView.Horizontal style={style}>
      {children}
    </ScrollView.Horizontal>
  }
  return <Row className='Tab__row' items='center' justify='around' style={style}>
    {children}
  </Row>
}

export const Tab = ({
  value,
  disabled,
  onChange,
  type = 'line',
  buttonColor,
  buttonRound,
  defaultValue,
  scroll,
  justify,
  expand,
  lazyload,
  style,
  tabStyle,
  className,
  children,
  ...props
}) => {

  const [layout, setLayout] = useState({})

  const [showExpand, setShowExpand] = useState(false)

  const [list, tabPane] = useMemo(() => {
    const _tabPane = []
    const _list = Children.map(children, (_child, index) => {
      const paneKey = _child?.props?.paneKey ?? index
      _tabPane[index] = {
        paneKey,
        el: _child?.props.children
      }
      return {
        ..._child?.props,
        paneKey
      }
    })
    return [_list, _tabPane]
  }, [children])

  const [select, setSelect] = useState(value ?? defaultValue ?? list?.[0]?.paneKey)

  // 懒加载模式记录哪些tab被加载了
  const shows = useRef([])
  if (!shows.current.includes(select)) {
    shows.current.push(select)
  }

  useMemo(() => {
    if (typeof value !== 'undefined') {
      setSelect(value)
    }
  }, [value])

  const change = useCallback(async i => {
    if (disabled) {
      return
    }
    const res = onChange?.(i)
    if (res instanceof Promise) {
      await res
    }
    setSelect(i)
    setShowExpand(false)
    setLayout({})
  }, [onChange, disabled])

  const tabs = <Scroll scroll={scroll} style={tabStyle}>
    {list.map((item, index) => <TabItem
      type={type}
      buttonColor={buttonColor}
      buttonRound={buttonRound}
      key={item.paneKey || index}
      scroll={scroll}
      {...item}
      select={item.paneKey === select}
      onClick={change}
    />)}
  </Scroll>

  return (
    <View className={classNames(Tab, className, justify && 'flex-grow')} style={style} {...props}>
      {
        expand && scroll ? <Layout className='flex-row' onLayout={e => showExpand && setLayout(e)} reloadKey={showExpand ? 1 : 0}>
          <Column grow>
            <Column className='inset-0 absolute' justify='center' items='center'>
              {tabs}
            </Column>
          </Column>
          <BoxShadow className='Tab__expand' x={-10} onClick={() => setShowExpand(true)}>
            <Text size={48}>
              <DuxuiIcon name='more-horizontal' />
            </Text>
          </BoxShadow>
          {showExpand && !!layout.width && <Absolute>
            <Column className='Tab__expand__mask-top absolute left-0 right-0 top-0' style={{ height: layout.top }} />
            <Column className='Tab__expand__mask absolute left-0 right-0 bottom-0' style={{ top: layout.top }}
              onClick={() => {
                setShowExpand(false)
                setLayout({})
              }}
            />
            <Space row wrap className='Tab__expand__content absolute left-0 right-0' style={{ top: layout.top }}>
              {list.map((item, index) => <TabItem
                type={type}
                buttonColor='page'
                buttonRound={buttonRound}
                key={item.paneKey || index}
                {...item}
                isExpand
                select={item.paneKey === select}
                onClick={change}
              />)}
            </Space>
          </Absolute>}
        </Layout> :
          tabs
      }
      {tabPane.some(v => typeof v.el !== 'undefined') && <View className='Tab__con'>
        {tabPane.map((item, index) => <View key={item.paneKey || index} className={classNames('Tab__con__item', item.paneKey === select && 'Tab__con__item--select')}>
          {(!lazyload || shows.current.includes(item.paneKey || index)) && item.el}
        </View>)}
      </View>}
    </View>
  )
}

Tab.Item = TabItem
