import { useMemo } from 'react'
import { htmlReplace } from '../utils/html'
import { LineEditorView } from './LineEditorView'
import { RichText } from './RichText'

export const HtmlView = ({
  html,
  style,
  className,
  previewImage,
  imageSpace,
  onLinkClick
}) => {

  const _html = useMemo(() => {
    try {
      const _value = JSON.parse(html)
      if (_value.blocks && _value.time && _value.version) {
        return _value
      } else {
        return html
      }
    } catch (error) {
      return html
    }
  }, [html])

  if (!html) {
    return null
  }

  if (_html && typeof _html === 'object') {
    return <LineEditorView blocks={_html.blocks} style={style} className={className || ''} previewImage={previewImage} imageSpace={imageSpace} />
  }

  return <RichText className={className || ''} style={style} nodes={htmlReplace(html)} />
}
