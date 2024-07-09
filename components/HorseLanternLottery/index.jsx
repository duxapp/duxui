import { Layout, px } from '@/duxapp'
import { useState, isValidElement, useCallback, useRef, useEffect } from 'react'
import { getSystemInfoSync } from '@tarojs/taro'
import { Column, Row } from '../Flex'

export const HorseLanternLottery = ({
  row = 3,
  column = 3,
  list = [],
  disabled,
  renderItem: Item,
  renderStart: Start,
  gap = 24,
  onStart,
  onEnd,
  onDisabledClick,
  style,
  ...props
}) => {
  const max = (row + column - 4) * 2 + 4

  const [layout, setLayout] = useState({})

  const [select, setSelect] = useState(0)
  const selectRef = useRef(select)
  selectRef.current = select

  const timer = useRef()

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  const task = useRef(false)

  const start = useCallback(async () => {
    if (disabled) {
      onDisabledClick?.()
    }
    if (disabled || task.current) {
      return
    }
    task.current = true
    const toResult = () => {
      // 计算记录目标还剩几个
      let to = 8
      let dTime = 20
      let startTimer = 60

      const callback = () => {
        startTimer += dTime
        dTime += 10
        timer.current = setTimeout(() => {
          to--
          setSelect(old => {
            return old >= max - 1 ? 0 : old + 1
          })
          if (to === 0) {
            task.current = false
            onEnd?.({ index: res })
          } else {
            callback()
          }
        }, startTimer)
      }
      callback()
    }
    let num = 0
    let maxNum
    timer.current = setInterval(() => {
      num++
      setSelect(old => {
        return old >= max - 1 ? 0 : old + 1
      })
      if (num === maxNum) {
        clearInterval(timer.current)
        toResult()
      }
    }, 60)
    let res = onStart?.()
    try {
      if (res instanceof Promise) {
        res = await res
      }
      if (typeof res !== 'number') {
        let min = 0
        res = parseInt(Math.random() * ((max - 1) - min + 1) + min, 10)
      }
      // 计算最大循环次数
      let to = res - selectRef.current
      if (to < 0) {
        to = max + to
      }
      maxNum = num + to + (max - 8)
      if (maxNum < max * 3) {
        maxNum += max * (3 - (maxNum / max | 0))
      }
    } catch (error) {
      task.current = false
      clearInterval(timer.current)
    }

  }, [disabled, max, onDisabledClick, onEnd, onStart])

  return <Layout style={{ ...style, gap: px(gap) }} onLayout={setLayout} {...props}>
    {
      !!layout.width && <>
        <Row style={{ gap: px(gap) }}>
          {
            Array(column).fill(1).map((_i, index) => {
              return <ItemSelf key={index} list={list} index={index} Item={Item} select={select} grow />
            })
          }
        </Row>
        <Row style={{ gap: px(gap) }}>
          <Column grow style={{ gap: px(gap) }}>
            {
              Array(row - 2).fill(1).map((_i, index) => {
                return <ItemSelf key={index} list={list} index={(row - 2 - index - 1) + column + row + column - 2} Item={Item} select={select} />
              })
            }
          </Column>
          <Column className='flex-shrink'
            style={{ width: (layout.width - toPx(gap) * (column - 1)) / column * (column - 2) + toPx(gap) * (column - 3) }}
            onClick={start}
          >
            {
              isValidElement(Start) ?
                Start :
                <Start />
            }
          </Column>
          <Column grow style={{ gap: px(gap) }}>
            {
              Array(row - 2).fill(1).map((_i, index) => {
                return <ItemSelf key={index} list={list} index={index + column} Item={Item} select={select} />
              })
            }
          </Column>
        </Row>
        <Row style={{ gap: px(gap) }}>
          {
            Array(column).fill(1).map((_i, index) => {
              return <ItemSelf key={index} list={list} index={(column - index - 2) + column + row - 1} Item={Item} select={select} grow />
            })
          }
        </Row>
      </>
    }
  </Layout>
}

const ItemSelf = ({ list, index, Item, select, ...props }) => {
  return <Column {...props}>
    <Item list={list} item={list[index]} index={index} select={index === select} />
  </Column>
}

const toPx = val => getSystemInfoSync().screenWidth / 750 * val
