import { useMemo } from 'react'
import { htmlParse } from '../utils/html'
import { LineEditorView } from './LineEditorView'
import { RichText } from './RichText'

export const HtmlView = props => {
  const {
    html,
    style,
    className,
    previewImage,
    imageSpace
  } = props

  const _html = useMemo(() => {
    try {
      const _value = JSON.parse(html)
      if (_value.blocks && _value.time && _value.version) {
        return _value
      } else {
        return typeof _value === 'string' ? htmlParse(_value) : htmlParse(html)
      }
    } catch (error) {
      return htmlParse(html)
    }
  }, [html])

  if (!html) {
    return null
  }

  if (_html && typeof _html === 'object') {
    return <LineEditorView blocks={_html.blocks} style={style} className={className || ''} previewImage={previewImage} imageSpace={imageSpace} />
  }

  return <RichText className={className || ''} style={style} nodes={_html} />
}
