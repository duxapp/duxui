import { useCallback, useRef, useState, createContext, useContext as useReactContext, useMemo } from 'react'
import { View, Text, Input, Image } from '@tarojs/components'
import { noop } from '@/duxapp/utils/util'
import { ScrollView, Layout } from '@/duxapp'
import searchIcon from './images/search.png'
import './index.scss'

const context = createContext({ setKeyword: noop })

const useContext = () => useReactContext(context)

export const ElevatorSearch = ({
  placeholder = '请输入关键词搜索'
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

  return <View className='Elevator__search'>
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
  renderNav = true,
  ...props
}) => {

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

  const layout = useCallback((e, index) => {
    layouts.current[index] = e.height
  }, [])

  const toGroup = useCallback(index => {
    setScrollTop(layouts.current.slice(0, index + 1).reduce((prev, current) => prev + current, 0))
  }, [])

  // const move = useCallback(e => {
  //   console.log(e)
  // }, [])

  // const moveEnd = useCallback(e => {
  //   console.log(e)
  // }, [])

  return <context.Provider value={{ keyword, setKeyword }}>
    <View className={`Elevator ${className}`} {...props}>
      {renderTop}
      <ScrollView scrollTop={scrollTop}>
        <Layout className='Elevator__group' onLayout={e => layout(e, 0)}>
          {renderHeader}
        </Layout>
        {
          resultList.map((group, groupIndex) => <Layout className='Elevator__group' key={group.index} onLayout={e => layout(e, groupIndex + 1)}>
            {renderNav && <View className='Elevator__group__name'>{group.name}</View>}
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
      {renderNav && <View className='Elevator__nav'>
        <View
          className='Elevator__nav__content'
        // onTouchMove={move}
        // onTouchEnd={moveEnd}
        >
          {
            resultList.map((group, groupIndex) => <Text className='Elevator__nav__item' onClick={() => toGroup(groupIndex)} key={group.name}>{group.name}</Text>)
          }
        </View>
      </View>}
    </View>
  </context.Provider>
}

Elevator.Search = ElevatorSearch
