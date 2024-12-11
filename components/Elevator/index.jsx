import { useCallback, useRef, useState, createContext, useContext as useReactContext, useMemo, useEffect } from 'react'
import { View, Text, Input, Image } from '@tarojs/components'
import { noop, px, pxNum, transformStyle } from '@/duxapp/utils/util'
import { ScrollView, Layout, Absolute } from '@/duxapp'
import classNames from 'classnames'
import searchIcon from './images/search.png'
import './index.scss'

const context = createContext({ setKeyword: noop })

const useContext = () => useReactContext(context)

export const ElevatorSearch = ({
  placeholder = '请输入关键词搜索',
  className,
  ...props
}) => {
  const { setKeyword } = useContext()

  const timer = useRef(null)
  const input = useCallback(e => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      timer.current = null
      setKeyword(e.detail.value)
    }, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <View className={classNames('Elevator__search', className)} {...props}>
    <Image src={searchIcon} className='Elevator__search__icon' />
    <Input className='Elevator__search__input' placeholder={placeholder} onInput={input} />
  </View>
}

export const Elevator = ({
  list,
  onItemClick,
  className,
  renderEmpty,
  renderTop,
  renderHeader,
  renderFooter,
  showNav = true,
  style,
  ...props
}) => {

  const [select, setSelect] = useState(-1)
  const currentSelect = useRef(select)
  currentSelect.current = select

  const [scrollTop, setScrollTop] = useState(0)

  const [keyword, setKeyword] = useState('')

  const resultList = useMemo(() => {
    if (!keyword) {
      return list
    }
    return list.reduce((prev, current) => {
      const children = current.children.filter(item => item.name.includes(keyword))
      if (children.length) {
        prev.push({ name: current.name, children })
      }
      return prev
    }, [])
  }, [list, keyword])

  const layouts = useRef([])

  const timer = useRef()

  const navLayout = useRef()

  useEffect(() => {
    return () => timer.current && clearTimeout(timer.current)
  }, [])

  const layout = useCallback((e, index) => {
    layouts.current[index] = e.height
  }, [])

  const toGroup = useCallback(index => {
    if (currentSelect.current === index) {
      return
    }
    currentSelect.current = index
    setSelect(index)
    timer.current && clearTimeout(timer.current)
    if (index !== -1) {
      timer.current = setTimeout(() => {
        setSelect(-1)
      }, 1000)
      setScrollTop(layouts.current.slice(0, index + 1).reduce((prev, current) => prev + current, 0))
    }
  }, [])

  const move = useCallback(e => {
    const touch = (e.touches || e.nativeEvent?.touches)?.[0]
    if (!touch) {
      return
    }
    const len = list.length
    let index = -1
    const y = touch.pageY - navLayout.current.top
    if (y > pxNum(8)) {
      const maxHeight = navLayout.current.height - pxNum(16)
      const itemHeight = maxHeight / len
      index = (y / itemHeight) | 0
    }
    if (index > len - 1) {
      index = len - 1
    }
    toGroup(index)
  }, [list.length, toGroup])

  return <context.Provider value={{ keyword, setKeyword }}>
    <View className={`Elevator ${className}`} style={style} {...props}>
      {renderTop}
      <ScrollView scrollTop={scrollTop}>
        <Layout className='Elevator__group' onLayout={e => layout(e, 0)}>
          {renderHeader}
        </Layout>
        {
          resultList.map((group, groupIndex) => <Layout className='Elevator__group' key={group.index} onLayout={e => layout(e, groupIndex + 1)}>
            {showNav && <View className='Elevator__group__name'>{group.name}</View>}
            {
              group.children.map(item => {
                return <View className='Elevator__group__item' key={item.name} onClick={() => onItemClick?.(item)}>{item.name}</View>
              })
            }
          </Layout>)
        }
        {resultList.length === 0 && renderEmpty}
        {renderFooter}
      </ScrollView>
      {showNav && <View className='Elevator__nav'
        onTouchMove={move}
      >
        <Layout
          onLayout={e => navLayout.current = e}
          className='Elevator__nav__content'
        >
          {
            resultList.map((group, groupIndex) => <Text
              className='Elevator__nav__item'
              onClick={() => toGroup(groupIndex)}
              key={group.name}
            >{group.name}</Text>)
          }
        </Layout>
      </View>}
    </View>
    {select !== -1 && <Absolute>
      <View className='Elevator__select'
        style={{
          transform: transformStyle({
            translateX: px(-120),
            translateY: px(-120),
          })
        }}
      >
        <Text className='Elevator__select__text'>{list[select].name}</Text>
      </View>
    </Absolute>}
  </context.Provider>
}

Elevator.Search = ElevatorSearch
