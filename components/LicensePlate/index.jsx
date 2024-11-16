import { px, PullView, noop, duxappTheme } from '@/duxapp'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Column, Row } from '../Flex'
import { Text } from '../Text'
import { Grid } from '../Grid'
import { DuxuiIcon } from '../DuxuiIcon'
import { InputCode } from '../Form/InputCode'
import { BoxShadow } from '../BoxShadow'
import { TouchableOpacity } from '../TouchableOpacity'
import carCity from './carCity.json'

const Keyboard = ({ onInput, onBackspace: onBackspaceInput }) => {

  const [{ length, value = '' }, setState] = useContext(context)

  const [keys, setKeys] = useState(value.split(''))

  useEffect(() => {
    setState(old => ({ ...old, value: keys.join('') }))
  }, [keys, setState])

  const onKey = key => {
    onInput?.(key)
    setKeys(old => {
      if (old.length >= length) {
        return old
      }
      return [...old, key]
    })
  }

  const onBackspace = () => {
    onBackspaceInput?.()
    setKeys(old => {
      old.pop()
      return [...old]
    })
  }

  return <>
    {!keys.length && <Province onKey={onKey} onBackspace={onBackspace} />}
    {keys.length === 1 && <City province={keys[0]} onKey={onKey} onBackspace={onBackspace} />}
    {keys.length > 1 && <Key onKey={onKey} onBackspace={onBackspace} />}
  </>
}

const Province = ({ onKey, onBackspace }) => {
  return <Grid column={7} square gap={16} className='self-stretch'>
    {
      carCity.map(item => <TouchableOpacity key={item.name} className='r-1 items-center justify-center bg-white'
        onClick={() => onKey(item.name)}
      >
        <Text bold>{item.name}</Text>
      </TouchableOpacity>)
    }
    <Column />
    <Column />
    <Column />
    <Del onBackspace={onBackspace} />
  </Grid>
}

const City = ({ province, onKey, onBackspace }) => {
  const citys = carCity.find(v => v.name === province).list

  const empty = useMemo(() => {
    const _empty = 5 - (citys.length % 5) - 1
    return Array(_empty < 0 ? 4 : _empty).fill(1)
  }, [citys.length])

  return <Grid column={5} square gap={16} className='self-stretch'>
    {
      citys.map(item => <TouchableOpacity key={item} className='r-1 items-center justify-center bg-white'
        onClick={() => onKey(item)}
      >
        <Text bold>{item}</Text>
      </TouchableOpacity>)
    }
    {
      empty.map((_v, i) => <Column key={i} />)
    }
    <Del onBackspace={onBackspace} />
  </Grid>
}

const Key = ({ onKey, onBackspace }) => {
  const [az, num] = useMemo(() => {
    return [
      [...Array(26).keys()].map(i => String.fromCharCode(i + 65)),
      [...Array(10).keys()]
    ]
  }, [])

  return <Column className='self-stretch items-center'>
    <Row className='gap-1 self-stretch'>
      {
        num.map(item => <TouchableOpacity
          className='flex-grow bg-white r-1 items-center justify-center'
          key={item}
          style={{ height: px(80) }}
          onClick={() => onKey(item)}
        >
          <Text bold>{item}</Text>
        </TouchableOpacity>)
      }
    </Row>
    <Grid column={9} gap={10} square className='mt-1 self-stretch'>
      {
        az.map(item => <TouchableOpacity key={item}
          className='r-1 items-center justify-center bg-white'
          onClick={() => onKey(item)}
        >
          <Text bold>{item}</Text>
        </TouchableOpacity>)
      }
      <Del onBackspace={onBackspace} />
    </Grid>
  </Column>
}

const Del = ({ style, onBackspace }) => {
  return <TouchableOpacity className='items-center justify-center' style={style} onClick={onBackspace}>
    <DuxuiIcon name='backspace' size={62} />
  </TouchableOpacity>
}

const Input = ({ length = 7, ...props }) => {

  const [value, setVal] = useContext(context)

  useMemo(() => {
    setVal(old => ({ ...old, length }))
  }, [length, setVal])

  return <InputCode value={value.value} focus length={length} {...props} />
}

const context = createContext([{ value: '', length: 7 }, noop])

const Provider = ({ children }) => {

  const state = useState({ value: '', length: 7 })

  return <context.Provider value={state}>
    {children}
  </context.Provider>
}

export const LicensePlate = ({ onChange, ...props }) => {

  const pullView = useRef()

  const [show, setShow] = useState(false)

  const state = useState({ value: '', length: 7 })

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [value] = state

  useEffect(() => {
    onChangeRef.current?.(value.value)
  }, [value.value])

  return <context.Provider value={state}>
    <Input onClick={() => setShow(true)} {...props} />
    {show && <PullView ref={pullView} masking={false} onClose={() => setShow(false)}>
      <BoxShadow className='p-3 bg-page gap-3 rt-3 items-center' style={{ backgroundColor: duxappTheme.pageColor }}>
        <context.Provider value={state}>
          <Row justify='end' items='center' self='stretch'>
            <Text type='primary' onClick={() => pullView.current.close()}>关闭</Text>
          </Row>
          <Keyboard />
        </context.Provider>
      </BoxShadow>
    </PullView>}
  </context.Provider>
}

LicensePlate.Keyboard = Keyboard
LicensePlate.Input = Input
LicensePlate.Provider = Provider
LicensePlate.context = context
