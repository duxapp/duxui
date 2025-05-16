import { Slider } from '@tarojs/components'
import { duxappTheme, px, transformStyle } from '@/duxapp'
import { useEffect, useRef, useState } from 'react'
import { Column, Row } from '../../Flex'
import { Text } from '../../Text'
import { DuxuiIcon } from '../../DuxuiIcon'

export const Range = ({ name, value = 12, min = 1, max = 100, onChange }) => {
  return <Row className='items-center gap-1'>
    {name && <Text size={1}>{name}</Text>}
    <Column style={{ width: px(150) }}>
      <Slider value={value}
        // onChange={e => onChange(e.detail.value)}
        onChanging={e => onChange(e.detail.value)}
        style={{ margin: 0 }}
        min={min}
        max={max}
        backgroundColor={duxappTheme.pageColor}
        blockSize={12}
        activeColor={duxappTheme.primaryColor}
        blockColor={duxappTheme.primaryColor}
      />
    </Column>
    <Text style={{ width: px(32) }} align='center'>{value}</Text>
  </Row>
}

export const Color = ({ value, onChange, addMenu }) => {

  const [show, setShow] = useState(false)

  const el = show && <Row className='justify-between items-center' grow>
    {
      colors.map(color => <Column key={color}
        className='r-1 square border-w1'
        style={{ width: px(42), backgroundColor: color, borderColor: duxappTheme.pageColor }}
        onClick={() => {
          onChange(color)
          setShow(false)
        }}
      />)
    }
    <DuxuiIcon name='close' size={42}
      className='text-c1 p-1'
      onClick={() => setShow(false)}
    />
  </Row>

  useAddMenu(el, addMenu)

  return <Row
    className='gap-1 items-center'
    onClick={() => setShow(true)}
  >
    <Column
      className='r-1 square border-w1'
      style={{ width: px(36), backgroundColor: value, borderColor: duxappTheme.pageColor }}
    />
    <DuxuiIcon name='direction_left'
      className='text-s4 tect-c2'
      style={{
        transform: transformStyle({
          rotateZ: '-90deg'
        })
      }}
    />
  </Row>
}

const colors = [
  duxappTheme.primaryColor,
  duxappTheme.secondaryColor,
  '#E64437',
  '#F1C244',
  '#8CCF42',
  '#4D83FA',
  '#fff',
  '#8E8E8E',
  '#000'
]

export const FillRadio = ({ value, onChange }) => {
  return <Row items='center' className='gap-2'>
    <Column className='items-center justify-center square r-1'
      style={{ width: px(46), backgroundColor: !value ? '#f2f2f2' : 'transparent' }}
      onClick={() => value && onChange(false)}
    >
      <Column
        className='square bg-primary r-1'
        style={{ width: px(12) }}
      />
    </Column>
    <Column className='items-center justify-center square r-1'
      style={{ width: px(46), backgroundColor: value ? '#f2f2f2' : 'transparent' }}
      onClick={() => !value && onChange(true)}
    >
      <Column
        className='square bg-primary r-1'
        style={{ width: px(28) }}
      />
    </Column>
  </Row>
}

export const useAddMenu = (el, addMenu) => {

  const addRef = useRef()

  useEffect(() => {
    if (el) {
      if (addRef.current) {
        addRef.current.update(el)
      } else {
        addRef.current = addMenu(el)
      }
    } else {
      addRef.current?.remove?.()
      addRef.current = undefined
    }
  }, [el, addMenu])
}
