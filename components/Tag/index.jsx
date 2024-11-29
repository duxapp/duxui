import { Children, useMemo } from 'react'
import classNames from 'classnames'
import { duxuiTheme } from '@/duxui/utils'
import { Row } from '../Flex'
import { Text } from '../Text'

import './index.scss'

const sizes = {
  s: 18,
  m: 1,
  l: 4
}

const stringTypes = ['string', 'number', 'boolean']

export const Tag = ({
  type = 'primary',
  size = 'm',
  color,
  texColor = type === 'default' ? 3 : undefined,
  plain,
  radiusType = duxuiTheme.tag.radiusType,
  className,
  style,
  children,
  ...props
}) => {
  const _style = useMemo(() => {
    const _sty = {}
    if (color) {
      if (plain) {
        _sty.borderColor = color
        _sty.color = color
      } else {
        _sty.backgroundColor = color
      }
    }
    if (texColor) {
      _sty.color = texColor
    }
    return _sty
  }, [color, plain, texColor])

  return <Row
    className={classNames(
      'Tag',
      'Tag--' + radiusType,
      !plain && 'Tag--' + type,
      plain && 'Tag--plain Tag--plain--' + type,
      size && 'Tag--' + size,
      className
    )}
    style={{ ...style, ..._style }}
    justify='center'
    items='center'
    {...props}
  >
    {
      Children.map(children, child => {
        if (stringTypes.includes(typeof child)) {
          return <Text {...plain ? { type } : { color: texColor || 4 }} size={sizes[size]}>{child}</Text>
        }
        // if (isValidElement(child)) {
        //   return cloneElement(child, {
        //     style: {
        //       ...child.props.style,
        //       color: '#fff'
        //     }
        //   })
        // }
        return child
      })
    }
  </Row>
}
