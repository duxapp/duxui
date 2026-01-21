import classNames from 'classnames'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, duxappTheme, px, pxNum, transformStyle } from '@/duxapp'
import { getImageInfo } from '@tarojs/taro'
import { duxuiLang } from '@/duxui/utils'
import { DuxuiIcon } from '../../DuxuiIcon'
import { Column, Row } from '../../Flex'
import { menus } from './Menus'
import { useAddMenu } from './Common'

export const SvgEditorController = ({
  style,
  className,
  mode,
  setMode,
  selectImage,
  editor,
  ...props
}) => {

  const t = duxuiLang.useT()

  const Menu = menus[mode]

  const event = props[mode]

  const [contents, setContents] = useState([
    controllers.map(item => <MenuItem
      key={item.name}
      name={item.name}
      mode={item.mode}
      select={mode === item.mode}
      onSelect={val => {
        if (val === 'image') {
          if (typeof selectImage === 'function') {
            selectImage().then(async src => {
              const info = await getImageInfo({ src })
              const scale = info.width / Math.min(info.width, pxNum(750))
              editor.current?.add({
                type: 'Image',
                attr: {
                  href: src,
                  width: info.width / scale,
                  height: info.height / scale
                }
              })
            })
          } else {
            throw new Error(t('svg.editor.needSelectImage'))
          }
        } else {
          setMode(val)
        }
      }}
    />)
  ])

  const refs = useRef({}).current

  refs.contents = contents

  const addMenu = useCallback(el => {

    const key = refs.contents.length

    const update = _el => {
      setContents(old => {
        old[key] = _el
        return [...old]
      })
    }

    update(el)

    return {
      remove: () => {
        setContents(old => {
          old.pop()
          return [...old]
        })
      },
      update
    }
  }, [refs.contents.length])

  const menu = useMemo(() => {
    return event && Menu && <>
      <Menu defaultValues={event.values} onChange={event.onChange} addMenu={addMenu} />
      <Column className='flex-grow' />
      <MenuItem name='close' onSelect={() => setMode()} />
    </>
  }, [Menu, addMenu, event, setMode])

  useAddMenu(menu, addMenu)

  const an = useRef()

  const [animation, setAnimation] = useState(Animated.defaultState)

  useEffect(() => {
    if (!an.current) {
      an.current = Animated.create({
        duration: 100
      })
    }
    setAnimation(an.current.translateY(`${-(contents.length - 1) * 100}%`).step({
      duration: 100
    }).export())
  }, [contents.length])

  return <Column
    style={{
      ...style,
      minHeight: px(80)
    }}
    className={classNames('overflow-hidden', className)}
  >
    <Animated.View
      className='absolute left-0 top-0 h-full w-full'
      style={{
        transform: transformStyle({
          translateY: '0%'
        })
      }}
      animation={animation}
    >
      {
        contents.map((el, index) => <Row
          key={index}
          className='absolute w-full h-full items-center left-0 gap-3 ph-3'
          style={{
            top: `${index * 100}%`
          }}
        >
          {el}
        </Row>)
      }
    </Animated.View>
  </Column>
}

const controllers = [
  { name: 'bianji', mode: 'path' },
  {
    name: 'tupian', mode: 'image', callback: () => {

    }
  },
  { name: 'wenben', mode: 'text' },
  { name: 'juxing', mode: 'rect' },
  { name: 'radio-on', mode: 'ellipse' },
  { name: 'xian', mode: 'line' }
]

const MenuItem = ({ name, mode, onSelect }) => {
  return <DuxuiIcon name={name} size={42}
    className='text-c1 p-1'
    onClick={() => onSelect(mode)}
  />
}

export const useSvgEditorController = () => {

  const [mode, setMode] = useState('edit')

  const editor = useRef()

  const [pathProps, setPathProps] = useState({
    stroke: duxappTheme.primaryColor,
    strokeWidth: 5
  })

  const [textProps, setTextProps] = useState({
    fill: duxappTheme.primaryColor,
    fontSize: 24
  })

  const [rectProps, setRectProps] = useState({
    stroke: duxappTheme.primaryColor,
    strokeWidth: 5
  })

  const [ellipseProps, setEllipseProps] = useState({
    stroke: duxappTheme.primaryColor,
    strokeWidth: 5
  })

  const [lineProps, setLineProps] = useState({
    stroke: duxappTheme.primaryColor,
    strokeWidth: 5
  })

  return {
    editor: {
      mode,
      pathProps,
      textProps,
      rectProps,
      ellipseProps,
      lineProps,
      ref: editor
    },
    controller: {
      editor,
      mode,
      setMode,
      path: {
        values: pathProps,
        onChange: setPathProps
      },
      text: {
        values: textProps,
        onChange: setTextProps
      },
      rect: {
        values: rectProps,
        onChange: setRectProps
      },
      ellipse: {
        values: ellipseProps,
        onChange: setEllipseProps
      },
      line: {
        values: lineProps,
        onChange: setLineProps
      }
    }
  }
}
