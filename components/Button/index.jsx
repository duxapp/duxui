import { View, Button as TaroButton } from '@tarojs/components'
import classNames from 'classnames'
import { useMemo } from 'react'
import { isPlatformMini, Loading, colorLighten, duxappTheme, theme, colorDark } from '@/duxapp'
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
    soft,
    openType,
    style,
    textStyle,
    disabled,
    loading,
    bold,
    className,
    onClick,
    renderContent,
    children,
    ...porps
  } = _props

  const linearGradient = color instanceof Array

  const _plain = linearGradient ? false : plain

  const isDark = theme.useIsDark()

  const [viewStyle, selfTextStyle] = useMemo(() => {
    // styles[0] -> view style; styles[1] -> text style
    const styles = [{}, {}]

    // Soft variant: background is lightened text color
    // When combined with plain, also show outline using baseColor
    if (soft && !linearGradient) {
      let baseColor
      if (type === 'default') {
        baseColor = typeof color === 'string' && color ? color : isDark ? duxappTheme.textColor4 : duxappTheme.textColor1
        // When custom color is provided, ensure text uses this color
        if (typeof color === 'string' && color) {
          styles[1].color = color
        }
      } else {
        const map = {
          primary: duxappTheme.primaryColor,
          secondary: duxappTheme.secondaryColor,
          success: duxappTheme.successColor,
          danger: duxappTheme.dangerColor,
          warning: duxappTheme.warningColor,
          custom1: duxappTheme.customColor1,
          custom2: duxappTheme.customColor2,
          custom3: duxappTheme.customColor3
        }
        baseColor = map[type]
      }
      if (baseColor) {
        styles[0].backgroundColor = isDark ? colorDark(baseColor, 0.2) : colorLighten(baseColor, 0.9)
        if (_plain) {
          styles[0].borderColor = baseColor
        }
      }
      return styles
    }

    // Default variant style handling (type === 'default')
    if (type === 'default') {
      if (color) {
        if (linearGradient) {
          // gradient handled by LinearGradient layer
        } else if (_plain) {
          styles[1].color = color
          styles[0].borderColor = color
        } else {
          styles[0].borderColor = color
          styles[0].backgroundColor = color
        }
      }
      return styles
    }

    return []
  }, [soft, color, linearGradient, _plain, type, isDark])

  return <duxuiHook.Render mark='Button' option={{ props: _props, linearGradient, plain: _plain, viewStyle, selfTextStyle }}>
    <RootView
      disabled={disabled}
      {...porps}
      {...(disabled || !onClick ? {} : { onClick })}
      className={classNames(
        'Button',
        !_plain && !soft && 'Button--' + type,
        _plain && 'Button--plain Button--plain-' + type,
        soft && 'Button--soft',
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
        className='absolute inset-0 z-0'
      />}
      {loading && <Loading
        color={_plain || soft || (type === 'default' && !color) ? 'dark' : 'blank'}
        size={duxuiTheme.button.sizes[size].fs * 1.4}
        className='Button__loading'
      />}
      {
        renderContent || <Text
          {...(_plain || soft) ? { type } : {}}
          {...type === 'default' ? { color: 1 } : {}}
          numberOfLines={1}
          bold={bold}
          className={classNames(
            'Button__text z-0',
            (!(_plain || soft) && (type !== 'default' || !!color)) && 'Button-c-white',
            'Button--fs-' + size
          )}
          style={{ ...selfTextStyle, ...textStyle }}
        >{children}</Text>
      }
    </RootView>
  </duxuiHook.Render>
}
