import { useState, useCallback, useMemo, Children, useRef } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { ScrollView, Layout, Absolute } from '@/duxapp'
import { Text } from '../Text'
import { Column, Row } from '../Flex'
import { DuxuiIcon } from '../DuxuiIcon'
import { BoxShadow } from '../BoxShadow'
import { Space } from '../Space'
import { Badge } from '../Badge'
import './index.scss'

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
  oneHidden,
  getItemStyle,
  ...props
}) => {

  const [layout, setLayout] = useState({})

  const [showExpand, setShowExpand] = useState(false)

  const [list, tabPane, badgeType] = useMemo(() => {
    const _tabPane = []
    let _badgeType = null
    const _list = Children.map(children, (_child, index) => {
      const paneKey = _child?.props?.paneKey ?? index

      if (_badgeType !== 'count') {
        if (typeof _child.props.badgeProps?.count !== 'undefined') {
          _badgeType = 'count'
        } else if (typeof _child.props.badgeProps?.dot === 'boolean') {
          _badgeType = 'dot'
        }
      }
      _tabPane[index] = {
        paneKey,
        el: _child
      }
      return {
        ..._child?.props,
        paneKey
      }
    }) || []
    return [_list, _tabPane, _badgeType]
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
  }, [onChange, disabled])

  const tabs = sty => <Scroll
    scroll={scroll}
    style={{ ...sty, ...expand && scroll ? undefined : tabStyle }}
  >
    {
      list.map((item, index) => <TabItem
        type={type}
        buttonColor={buttonColor}
        buttonRound={buttonRound}
        key={item.paneKey || index}
        scroll={scroll}
        badgeType={badgeType}
        {...item}
        select={item.paneKey === select}
        onClick={change}
        getItemStyle={getItemStyle}
      />)
    }
  </Scroll>

  return (
    <View className={classNames('Tab', className, justify && 'flex-grow')} style={style} {...props}>
      {
        oneHidden && list.length < 2 ?
          null : expand && scroll ?
            <Layout className='flex-row items-center self-stretch' style={tabStyle} onLayout={setLayout} reloadKey={showExpand ? 1 : 0}>
              {
                process.env.TARO_ENV === 'harmony' ?
                  <Row grow items='center'>
                    {!!layout.height && tabs({ width: '100%', height: layout.height })}
                  </Row> :
                  <Row grow self='stretch'>
                    <Column className='inset-0 absolute' justify='center'>
                      {tabs()}
                    </Column>
                  </Row>
              }
              <BoxShadow className='Tab__expand' x={-10} onClick={() => setShowExpand(true)}>
                <DuxuiIcon name='more-horizontal' size={48} />
              </BoxShadow>
              {showExpand && !!layout.width && <Absolute>
                <Column className='Tab__expand__mask-top absolute left-0 right-0 top-0' style={{ height: layout.top }} />
                <Column className='Tab__expand__mask absolute left-0 right-0 bottom-0' style={{ top: layout.top }}
                  onClick={() => {
                    setShowExpand(false)
                  }}
                />
                <Space row wrap className='Tab__expand__content absolute left-0 right-0' style={{ top: layout.top }}>
                  {list.map((item, index) => <TabItem
                    type={type}
                    buttonColor='page'
                    buttonRound={buttonRound}
                    key={item.paneKey || index}
                    badgeType={badgeType}
                    {...item}
                    isExpand
                    select={item.paneKey === select}
                    onClick={change}
                    getItemStyle={getItemStyle}
                  />)}
                </Space>
              </Absolute>}
            </Layout> :
            tabs()
      }
      {tabPane.some(v => typeof v.el !== 'undefined') && <View className='Tab__con'>
        {tabPane.map((item, index) => <View key={item.paneKey || index} className={classNames('Tab__con__item', item.paneKey === select && 'Tab__con__item--select')}>
          {(!lazyload || shows.current.includes(item.paneKey || index)) && item.el}
        </View>)}
      </View>}
    </View>
  )
}

const TabItem = ({
  type,
  buttonColor,
  buttonRound,
  title,
  paneKey,
  select,
  onClick,
  isExpand,
  scroll,
  badgeType,
  badgeProps,
  getItemStyle
}) => {

  const { text, line, container } = getItemStyle?.({ select }) || {}

  if (type === 'button') {
    return <Column
      self='center'
      className={classNames(
        'Tab__item--button',
        badgeType && 'Tab__item--' + badgeType,
        buttonColor && 'Tab__item--button-c-' + buttonColor,
        buttonRound && 'Tab__item--button-round',
        select && 'Tab__item--button-select',
        isExpand && 'Tab__item--button-expand',
      )}
      onClick={() => onClick(paneKey)}
      style={container}
    >
      {/* <BadgeText badgeProps={badgeProps} outside>

      </BadgeText> */}
      <Text style={text} color={select ? 4 : 1} size={4}>{title}</Text>
    </Column>
  }

  return <Column
    self='center'
    className={classNames(scroll && 'Tab__item', badgeType && 'Tab__item--' + badgeType)}
    items='center'
    justify='center'
    onClick={() => onClick(paneKey)}
    style={container}
  >
    <BadgeText badgeProps={badgeProps}>
      <Text style={text} type={select ? 'primary' : void 0} color={select ? void 0 : 2} bold size={4}>{title}</Text>
    </BadgeText>
    <View style={line} className={classNames('Tab__item__line', select && 'Tab__item__line--hover')} />
  </Column>
}

const Item = ({ children }) => {
  return children
}

Tab.Item = Item

const BadgeText = ({ children, badgeProps, outside }) => {
  if (!badgeProps || (!badgeProps.count && !badgeProps.dot)) {
    return children
  }
  return <Badge outside={outside} {...badgeProps}>
    {children}
  </Badge>
}

const Scroll = ({
  scroll,
  style,
  children
}) => {
  if (scroll) {
    return <ScrollView.Horizontal style={style} className='Tab__row'>
      {children}
    </ScrollView.Horizontal>
  }
  return <Row className='Tab__row' items='center' justify='around' style={style}>
    {children}
  </Row>
}
