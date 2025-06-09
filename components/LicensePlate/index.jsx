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

export const LicensePlateContext = /*@__PURE__*/ createContext([{ value: '', length: 7 }, noop])

export const LicensePlateKeyboard = ({ onInput, onBackspace: onBackspaceInput }) => {

  const [{ length, value = '' }, setState] = useContext(LicensePlateContext)

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
  return <Grid column={7} square gap={16}>
    {
      carCity.map(item => <TouchableOpacity key={item.name} className='r-1 justify-center bg-white items-center'
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

  return <Grid column={5} square gap={16}>
    {
      citys.map(item => <TouchableOpacity key={item} className='r-1 justify-center bg-white items-center'
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

  return <Column>
    <Row className='gap-1'>
      {
        num.map(item => <TouchableOpacity
          className='flex-grow bg-white r-1 justify-center items-center'
          key={item}
          style={{ height: px(80) }}
          onClick={() => onKey(item)}
        >
          <Text bold>{item}</Text>
        </TouchableOpacity>)
      }
    </Row>
    <Grid column={9} gap={10} square className='mt-1'>
      {
        az.map(item => <TouchableOpacity key={item}
          className='r-1 justify-center bg-white items-center'
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
  return <TouchableOpacity className='justify-center items-center' style={style} onClick={onBackspace}>
    <DuxuiIcon name='backspace' size={62} />
  </TouchableOpacity>
}

export const LicensePlateInput = ({ length = 7, ...props }) => {

  const [value, setVal] = useContext(LicensePlateContext)

  useMemo(() => {
    setVal(old => ({ ...old, length }))
  }, [length, setVal])

  return <InputCode value={value.value} focus length={length} {...props} />
}

export const LicensePlateProvider = ({ children }) => {

  const state = useState({ value: '', length: 7 })

  return <LicensePlateContext.Provider value={state}>
    {children}
  </LicensePlateContext.Provider>
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

  return <LicensePlateContext.Provider value={state}>
    <LicensePlateInput onClick={() => setShow(true)} {...props} />
    {show && <PullView ref={pullView} masking={false} onClose={() => setShow(false)}>
      <BoxShadow className='p-3 bg-page gap-3 rt-3' style={{ backgroundColor: duxappTheme.pageColor }}>
        <LicensePlateContext.Provider value={state}>
          <Row justify='end' items='center' self='stretch'>
            <Text type='primary' onClick={() => pullView.current.close()}>关闭</Text>
          </Row>
          <LicensePlateKeyboard />
        </LicensePlateContext.Provider>
      </BoxShadow>
    </PullView>}
  </LicensePlateContext.Provider>
}
