import { View, Button as TaroButton } from '@tarojs/components'
import classNames from 'classnames'
import { useMemo } from 'react'
import { isPlatformMini, Loading } from '@/duxapp'
import { duxuiTheme, duxuiHook } from '@/duxui/utils'
import { LinearGradient } from '../LinearGradient'
import { Text } from '../Text'
import { TouchableOpacity } from '../TouchableOpacity'
import './index.scss'

const RootView = ({
  openType,
  disabled,
  style,
  className,
  ...props
}) => {
  if (isPlatformMini && openType) {
    return <TaroButton openType={openType} style={style} className={classNames('button-clean', className)} {...props} />
  }
  const RenderView = disabled ? View : TouchableOpacity
  return <RenderView activeOpacity={0.5} style={style} className={className} {...props} />
}

export const Button = _props => {

  const {
    type = 'default',
    color = duxuiTheme.button.color,
    colorAngle = 90,
    radiusType = duxuiTheme.button.radiusType,
    size = duxuiTheme.button.size,
    plain = duxuiTheme.button.plain,
    openType,
    style,
    textStyle,
    disabled,
    loading,
    className,
    onClick,
    renderContent,
    children,
    ...porps
  } = _props

  const linearGradient = color instanceof Array

  const _plain = linearGradient ? false : plain

  const [viewStyle, selfTextStyle] = useMemo(() => {
    if (type !== 'default') {
      return []
    }
    const styles = [{}, {}]
    if (color) {
      if (linearGradient) {

      } else if (_plain) {
        styles[1].color = color
        styles[0].borderColor = color
      } else {
        styles[0].borderColor = color
        styles[0].backgroundColor = color
      }
    }

    return styles
  }, [color, linearGradient, _plain, type])

  return <duxuiHook.Render mark='Button' option={{ props: _props, linearGradient, plain: _plain, viewStyle, selfTextStyle }}>
    <RootView
      disabled={disabled}
      {...porps}
      {...(disabled || !onClick ? {} : { onClick })}
      className={classNames(
        'Button',
        !_plain && 'Button--' + type,
        _plain && 'Button--plain Button--plain-' + type,
        'Button--' + radiusType,
        disabled && 'Button--disabled',
        linearGradient && 'Button--linear',
        'Button--' + size,
        className
      )}
      openType={openType}
      style={{
        ...viewStyle,
        ...style
      }}
    >
      {linearGradient && <LinearGradient
        colors={color}
        useAngle
        angle={colorAngle}
        className='Button__linear z-0'
      />}
      {loading && <Loading
        color={_plain || (type === 'default' && !color) ? 'dark' : 'blank'}
        size={duxuiTheme.button.sizes[size].fs * 1.4}
        className='Button__loading'
      />}
      {
        renderContent || <Text
          {..._plain ? { type } : {}}
          {...type === 'default' ? { color: 1 } : {}}
          numberOfLines={1}
          className={classNames(
            'Button__text z-0',
            (!_plain && type !== 'default' || color) && 'Button-c-white',
            'Button--fs-' + size
          )}
          style={{ ...selfTextStyle, ...textStyle }}
        >{children}</Text>
      }
    </RootView>
  </duxuiHook.Render>
}

