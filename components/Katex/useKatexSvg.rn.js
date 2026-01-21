import { useMemo } from 'react'
import { mathjaxToSvg } from './mathjaxToSvg'

export function useKatexSvg({
  math,
  inline,
  color,
  scale,
  config,
  onError
}) {
  const configKey = useMemo(() => {
    try {
      return JSON.stringify(config || {})
    } catch (e) {
      return String(Date.now())
    }
  }, [config])

  return useMemo(() => {
    try {
      const result = mathjaxToSvg(math, { ...config, inline }, { color, scale })
      return { svg: result.svg, size: result.size, error: null }
    } catch (error) {
      onError?.(error)
      return { svg: null, size: null, error }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [math, inline, color, scale, configKey])
}
