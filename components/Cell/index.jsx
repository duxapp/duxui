import { Text, View } from '@tarojs/components'
import React, { createContext, useContext } from 'react'
import { duxappTheme } from '@/duxui/utils'
import classNames from 'classnames'
import { Divider } from '../Divider'
import { BoxShadow } from '../BoxShadow'
import './index.scss'

const context = createContext({ group: false })

const Root = ({
  children,
  radius,
  ...props
}) => {

  const { group } = useContext(context)

  if (group) {
    return <View className='Cell CellItem' {...props}>
      {children}
    </View>
  }
  return <BoxShadow className='Cell' radius={radius} {...props}>
    {children}
  </BoxShadow>
}

const Group = ({
  line = true,
  radius = duxappTheme.common.radiusValue,
  children,
  className,
  style
}) => {
  return <>
    <BoxShadow className={classNames('CellGroup', className)} style={style} radius={radius}>
      <context.Provider value={{ group: true }}>
        {
          line
            ? React.Children.map(children, (child, index) => {
              return <React.Fragment key={index}>
                {index !== 0 && <Divider padding={0} />}
                {child}
              </React.Fragment>
            })
            : children
        }
      </context.Provider>
    </BoxShadow>
  </>
}

export const Cell = ({
  title,
  subTitle,
  desc,
  renderIcon,
  isLink,
  radius = duxappTheme.common.radiusValue,
  ...props
}) => {
  return <Root radius={radius} isLink={isLink} {...props}>
    <View className={`Cell__left${subTitle ? ' Cell__left--col' : ''}`}>
      {!!renderIcon && !subTitle && <View className='Cell__icon'>
        {renderIcon}
      </View>}
      {
        React.isValidElement(title)
          ? title
          : <Text className='Cell__title'>{title}</Text>
      }
      {
        !!subTitle && (React.isValidElement(subTitle)
          ? subTitle
          : <Text className='Cell__subtitle'>{subTitle}</Text>)
      }
    </View>
    {
      React.isValidElement(desc)
        ? desc
        : <View className='Cell__right'>
          <Text className='Cell__desc'>{desc}</Text>
        </View>
    }
  </Root>
}

Cell.Group = Group
