import { Loading, PullView, px, TopView, loading } from '@/duxapp'
import { getRecorderManager, createInnerAudioContext } from '@tarojs/taro'
import classNames from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Column, Row } from '../Flex'
import { DuxuiIcon } from '../DuxuiIcon'
import { Grid } from '../Grid'
import { Text } from '../Text'
import { Button } from '../Button'
import { formConfig } from './config'
import { Form } from './Form'
import './Upload.scss'

export const Recorder = ({
  max = 1,
  value,
  onChange,
  defaultValue,
  ...props
}) => {

  const [val, setValue] = Form.useFormItemProxy({ value, onChange, defaultValue })

  if (max === 1) {
    return <RecorderOne {...props} value={val} onChange={setValue} />
  }
  return <AudioRecorder {...props} value={val} onChange={setValue} max={max} />
}

const AudioRecorder = ({
  value,
  onChange,
  disabled,
  max = 1,
  column = 4,
  option,
  tip = '录制'
}) => {

  if (!value) {
    value = []
  }

  const del = useCallback((index) => {
    value.splice(index, 1)
    onChange([...value])
  }, [onChange, value])

  const [progress, setProgress] = useState(-1)

  const add = useCallback(async () => {
    try {
      const file = await AddAudio.add()
      const upload = formConfig.getUploadTempFile()
      const urls = await upload([
        file
      ], option)
        .start(() => {
          setProgress(0)
        })
        .progress(setProgress)
      setProgress(-1)
      onChange([...value || [], ...urls])
    } catch (error) {
      console.log('音频上传失败', error)
      setProgress(-1)
    }
  }, [onChange, option, value])

  const isOne = max === 1

  const content = [
    ...value?.map((item, index) => {
      return <Column
        className={classNames('UIUplod__item', isOne && 'UIUplod__item--one')}
        justify='center'
        items='center'
        key={item}
      >
        <ItemPlay src={item} />
        {!disabled && <Column className='UIUplod__item__icon'>
          <DuxuiIcon name='close' color='red' size={36} onClick={() => del(index)} />
        </Column>}
      </Column>
    }),
    (value?.length || 0) < max && !disabled &&
    <Column
      grow={!isOne}
      className={classNames('UIUplod__item', isOne && 'UIUplod__item--one')}
      justify='center'
      onClick={!~progress && add}
    >
      {
        ~progress ?
          <>
            <Loading />
            <Text color={2} size={2}>{(progress * 100).toFixed(1)}%</Text>
          </> :
          <>
            <Column style={{ width: px(46) }} items='center' justify='center' self='center'
              className='square r-max border-w1 border-danger'
            >
              <Column style={{ width: px(18) }} className='square r-1 bg-danger' />
            </Column>
            <Text color={2} size={2}>{tip}</Text>
          </>
      }
    </Column>
  ]

  if (isOne) {
    return content
  }

  return <Grid column={column} square gap={24}>
    {content}
  </Grid>
}

const ItemPlay = ({ src }) => {

  const audioRef = useRef()

  const [play, setPlay] = useState(false)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stop?.()
      }
    }
  }, [])

  return <Column style={{ width: px(100) }} items='center' justify='center' self='center'
    className='square r-max border-w1 border-primary'
    onClick={() => {
      if (play) {
        audioRef.current.stop()
      } else {
        const audio = audioRef.current = audioPlay(src)
        setPlay(true)
        audio.onDestroy(() => {
          setPlay(false)
        })
      }
    }}
  >
    {
      play ?
        <TimerPlay /> :
        <DuxuiIcon name='voice-right' size={72} className='text-primary' />
    }
  </Column>
}

const RecorderOne = ({
  onChange,
  value,
  ...props
}) => {
  return <AudioRecorder max={1} onChange={val => onChange(val[0])} value={value ? [value] : []}  {...props} />
}

const AddAudio = ({
  onSubmit,
  onClose
}) => {

  const pullView = useRef()

  const RecorderManager = useRef()

  const audioRef = useRef()

  const [status, setStatus] = useState(false)

  const [result, setResult] = useState({})

  const [play, setPlay] = useState(false)

  useEffect(() => {
    return () => {
      if (RecorderManager.current) {
        RecorderManager.current.onStop(() => {

        })
        RecorderManager.current.stop()
      }
      if (audioRef.current) {
        audioRef.current.stop?.()
      }
    }
  }, [])

  const start = useCallback(() => {
    if (status) {
      RecorderManager.current.stop()
    } else {
      if (audioRef.current) {
        audioRef.current.stop?.()
      }
      setResult({})
      const stop = loading('加载中', true)
      const recorder = RecorderManager.current = getRecorderManager()
      recorder.start({
        duration: 60000,
        format: 'mp3'
      })
      recorder.onStart(() => {
        setStatus(true)
        stop()
      })
      recorder.onError(() => {
        RecorderManager.current = null
        setStatus(false)
        stop()
      })
      recorder.onStop(res => {
        stop()
        RecorderManager.current = null
        setStatus(false)
        setResult({
          path: res.tempFilePath,
          size: res.fileSize,
          duration: res.duration
        })
      })
    }
  }, [status])

  return <PullView ref={pullView} onClose={onClose}>
    <Column className='rt-3 bg-white p-3 gap-3 items-center'>
      <Text align='center' bold>音频录制</Text>
      {
        result.path ?
          <>
            <Column style={{ width: px(100) }} items='center' justify='center' self='center'
              className='square r-max mt-3 border-w1 border-primary'
              onClick={() => {
                if (play) {
                  audioRef.current.stop()
                } else {
                  const audio = audioRef.current = audioPlay(result.path)
                  setPlay(true)
                  audio.onDestroy(() => {
                    setPlay(false)
                  })
                }
              }}
            >
              {
                play ?
                  <TimerPlay /> :
                  <DuxuiIcon name='voice-right' size={72} className='text-primary' />
              }
            </Column>
            {
              play ?
                <Timer type='primary' /> :
                <Text align='center' size={1} type='primary'>播放</Text>
            }

          </> :
          <>
            <Column style={{ width: px(100) }} items='center' justify='center' self='center'
              className={classNames('square r-max mt-3', status ? 'bg-danger' : 'border-w1 border-danger')}
              onClick={start}
            >
              <Column style={{ width: px(40) }} className={classNames('square r-max', status ? 'bg-white' : 'bg-danger')} />
            </Column>
            {
              status ?
                <Timer /> :
                <Text align='center' size={1} type='danger'>点击开始录制</Text>
            }
          </>
      }
      <Row className='gap-4 p-3 mt-3 self-stretch' style={{ height: px(160) }}>
        {
          !!result.path && <>
            <Button type='primary' plain className='flex-grow'
              onClick={start}
            >重录</Button>
            <Button type='primary' className='flex-grow'
              onClick={() => onSubmit(result)}
            >提交</Button>
          </>
        }
      </Row>
    </Column>
  </PullView>
}

const Timer = props => {

  const [time, setTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(old => old + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return <Text align='center' size={1} type='danger' {...props}>{[time / 60 | 0, time % 60].map(item => item < 10 ? `0${item}` : item).join(':')}</Text>
}

const TimerPlay = () => {

  const icons = ['voice-right_01', 'voice-right_02', 'voice-right']
  const [icon, setIcon] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIcon(old => {
        if (old + 1 > 2) {
          return 0
        }
        return old + 1
      })
    }, 300)
    return () => clearInterval(timer)
  }, [])

  return <DuxuiIcon name={icons[icon]} size={72} className='text-primary' />
}

AddAudio.add = () => {
  return new Promise((resolve, reject) => {
    const { remove } = TopView.add([
      AddAudio,
      {
        onSubmit: res => {
          remove()
          resolve(res)
        },
        onClose: () => {
          remove()
          reject('取消')
        }
      }
    ])
  })
}

Recorder.start = AddAudio.add

const audioPlay = (() => {
  let innerAudioContext = null
  let onDestroy = null
  return src => {
    if (innerAudioContext) {
      if (onDestroy) {
        onDestroy()
      } else {
        innerAudioContext.destroy()
      }
    }
    innerAudioContext = createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = src

    innerAudioContext.onDestroy = callback => {
      onDestroy = () => {
        innerAudioContext.destroy()
        innerAudioContext = null
        onDestroy = null
        callback()
      }
    }
    innerAudioContext.onStop(() => {
      onDestroy?.()
    })
    innerAudioContext.onError(() => {
      onDestroy?.()
    })
    innerAudioContext.onEnded(() => {
      onDestroy?.()
    })

    return innerAudioContext
  }
})();
