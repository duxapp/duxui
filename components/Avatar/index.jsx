import React, { useMemo, Children, Fragment, cloneElement } from 'react'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames'
import { duxuiTheme, px } from '@/duxui/utils'

import './index.scss'

const AvatarGroup = ({
  size = duxuiTheme.avatar.size,
  radiusType = duxuiTheme.avatar.radiusType,
  color,
  bgColor,
  iconSize,
  children,
  span = -16,
  max,
  maxProps,
  style,
  className,
  ...props
}) => {

  const itemSize = duxuiTheme.avatar.sizes[size]

  return <View className={classNames('AvatarGroup', 'AvatarGroup--' + size, className)} style={style} {...props}>
    {
      Children.map(children, (child, index) => {
        if ((max ?? false) !== false) {
          if (index > max) {
            return <Fragment />
          } else if (index === max) {
            return <Avatar
              size={size} radiusType={radiusType} color={color} bgColor={bgColor} iconSize={iconSize}
              {...maxProps}
              className='AvatarGroup__avatar'
              style={{
                left: px(index * (itemSize + span))
              }}
            >{maxProps?.children || '+N'}</Avatar>
          }
        }
        return cloneElement(child, {
          size, radiusType, color, bgColor, iconSize,
          className: classNames(child.props.className, 'AvatarGroup__avatar'),
          style: {
            left: px(index * (itemSize + span))
          }
        })
      })
    }
  </View>
}

export const Avatar = ({
  size = duxuiTheme.avatar.size,
  radiusType = duxuiTheme.avatar.radiusType,
  color,
  bgColor,
  url,
  icon,
  iconSize,
  className,
  style,
  children,
  __hmStyle,
  ...props
}) => {

  url = url || duxuiTheme.avatar.url

  const [viewStyle, textStyle] = useMemo(() => {
    const _sty = { ...style }
    if (bgColor) {
      _sty.backgroundColor = bgColor
    }
    const __style = {}
    if (color) {
      __style.color = color
    }
    return [_sty, __style]
  }, [color, bgColor, style])

  return (
    <View className={classNames('Avatar', 'Avatar--' + size, 'Avatar--' + radiusType, className)} style={viewStyle} {...props}>
      {
        url
          ? <Image src={url} className='Avatar__image' mode='aspectFill' />
          : icon
            ? React.cloneElement(icon, { size: iconSize || duxuiTheme.avatar.iconSize, color: color || duxuiTheme.avatar.color })
            : <Text className={classNames('Avatar__text Avatar--text-color', 'Avatar__text--' + size)} style={textStyle}>{children || 'User'}</Text>
      }
    </View>
  )
}

Avatar.Group = AvatarGroup
