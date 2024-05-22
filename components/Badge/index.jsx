import { View, Text } from '@tarojs/components'
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { Layout } from '@/duxapp'
import './index.scss'

const BadgeNumber = ({
  count,
  dot,
  color = '#e87369',
  text,
  maxCount = 99,
  child,
  outside,
  layout,
  ...props
}) => {

  const style = useMemo(() => {
    if (!color || color === '#e87369') {
      return {}
    }
    return {
      backgroundColor: color
    }
  }, [color])

  return <>
    {
      (!!count || !!text || dot) && <>
        {
          !dot ?
            <>
              {(outside && !!layout.width || !outside) && <View
                className={classNames('Badge__count', !outside && child && 'Badge__count--child', outside && 'Badge__count--outside')}
                style={{
                  ...style,
                  ...outside ? {
                    left: layout.width - 4,
                  } : {}
                }}
                {...props}
              >
                <Text className='Badge__count__text'>{text || (count > maxCount ? maxCount + '+' : count)}</Text>
              </View>}
            </> :
            <View
              className={classNames('Badge__dot', child && 'Badge__dot--child')}
              style={style}
              {...props}
            />
        }
      </>
    }
  </>
}

export const Badge = ({
  count,
  dot,
  color,
  text,
  maxCount,
  outside,
  children,
  style,
  className,
  ...props
}) => {

  const [layout, setLayout] = useState({ width: 0, height: 0 })

  if (children) {
    if (outside) {
      return <Layout style={style} className={`Badge${className ? ' ' + className : ''}`} {...props} onLayout={setLayout}>
        {children}
        <BadgeNumber count={count} dot={dot} color={color} text={text} maxCount={maxCount} child outside layout={layout} />
      </Layout>
    }
    return <View style={style} className={`Badge${className ? ' ' + className : ''}`} {...props}>
      {children}
      <BadgeNumber count={count} dot={dot} color={color} text={text} maxCount={maxCount} child />
    </View>
  } else {
    return <BadgeNumber count={count} dot={dot} color={color} text={text} maxCount={maxCount} {...props} />
  }
}
