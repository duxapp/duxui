import { RichText } from '@tarojs/components'
import { useMemo } from 'react'
import { duxappTheme } from '@/duxapp'

import { latexParse } from './katexToNodes'
import './index.css'

export const Katex = ({
  math = '',
  inline = true,
  color = duxappTheme.textColor1,
  config,
  style,
  ...props
}) => {
  const nodes = useMemo(() => {
    const options = { ...(config || {}), displayMode: !inline }
    return latexParse(math, options, color)
  }, [math, config, inline, color])

  return <RichText nodes={nodes} style={style} {...props} />
}
