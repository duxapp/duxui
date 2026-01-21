import React from 'react'
import { Text } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { duxappTheme } from '@/duxapp'
import { duxuiLang } from '@/duxui/utils'

import { useKatexSvg } from './useKatexSvg'

const defaultRenderError = ({ error, style }) => (
  <Text style={[{ color: '#f5222d' }, style]}>
    {error?.message || duxuiLang.t('katex.renderFail')}
  </Text>
)

const isRenderable = node => typeof node === 'string' || typeof node === 'number' || !!node

export const Katex = ({
  math = '',
  inline = true,
  color = duxappTheme.textColor1,
  scale = 1,
  resizeMode = 'cover',
  config,
  renderError,
  onError,
  style,
  ...svgProps
}) => {
  const state = useKatexSvg({ math, inline, color, scale, config, onError })

  if (state.error) {
    if (React.isValidElement(renderError)) {
      return renderError
    }
    if (typeof renderError === 'function') {
      const node = renderError({ math, error: state.error })
      if (isRenderable(node)) {
        return node
      }
    }
    return defaultRenderError({ error: state.error, style })
  }

  if (!state.svg || !state.size) {
    return null
  }

  const containStyle = resizeMode === 'contain' ? { maxWidth: '100%', maxHeight: '100%' } : null

  return (
    <SvgXml
      xml={state.svg}
      width={state.size.width}
      height={state.size.height}
      style={[containStyle, style]}
      {...svgProps}
    />
  )
}
