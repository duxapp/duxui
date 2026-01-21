import { duxappTheme } from '@/duxapp'

const hasCssProp = (styleText, prop) => {
  if (!styleText) return false
  const reg = new RegExp(`(^|;)\\s*${prop}\\s*:`, 'i')
  return reg.test(styleText)
}

const appendCssPropsIfMissing = (styleText, props) => {
  const normalized = (styleText || '').trim()
  let result = normalized
  const suffix = result && !/;\s*$/.test(result) ? ';' : ''
  result = result + suffix
  for (const [prop, value] of props) {
    if (!hasCssProp(result, prop)) {
      result += `${prop}:${value};`
    }
  }
  return result
}

const mergeStyleAttr = (attrText, styleProps) => {
  const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
  const match = attrText.match(styleAttrReg)

  if (match) {
    const quote = match[0].includes('"') ? '"' : "'"
    const originalStyle = match[1] ?? match[2] ?? ''
    const nextStyle = appendCssPropsIfMissing(originalStyle, styleProps)
    return attrText.replace(styleAttrReg, ` style=${quote}${nextStyle}${quote}`)
  }

  const nextStyle = appendCssPropsIfMissing('', styleProps)
  return `${attrText} style="${nextStyle}"`
}

const replaceOpeningTag = (html, tagName, stylePropsGetter) => {
  const reg = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi')
  return html.replace(reg, (match, attrs) => {
    const endSlash = /\s*\/\s*$/.test(attrs)
    const attrsNoSlash = attrs.replace(/\s*\/\s*$/, '')
    const styleProps = stylePropsGetter(match, attrsNoSlash)
    if (!styleProps || styleProps.length === 0) {
      return match
    }
    const nextAttrs = mergeStyleAttr(attrsNoSlash, styleProps)
    return `<${tagName}${nextAttrs}${endSlash ? ' />' : '>'}`
  })
}

export const htmlParse = html => {
  if (typeof html !== 'string') return ''

  const defaultTextColor = duxappTheme?.textColor1 || '#333'
  const defaultSecondaryTextColor = duxappTheme?.textColor2 || '#666'
  const defaultBorderColor = duxappTheme?.lineColor || '#f0f0f0'
  const defaultLinkColor = duxappTheme?.primaryColor || defaultTextColor
  const defaultCodeBg = duxappTheme?.lineColor || '#f5f5f5'

  let next = html
    .replace(/<section\b/gi, '<div')
    .replace(/<\/section\b/gi, '</div')

  next = replaceOpeningTag(next, 'img', () => ([
    ['max-width', '100%'],
    ['height', 'auto'],
    ['display', 'block']
  ]))

  next = replaceOpeningTag(next, 'p', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    if (!hasCssProp(styleText, 'line-height')) {
      props.push(['line-height', '1.6'])
    }

    const hasAnyMargin =
      hasCssProp(styleText, 'margin') ||
      hasCssProp(styleText, 'margin-top') ||
      hasCssProp(styleText, 'margin-bottom')
    if (!hasAnyMargin) {
      props.push(['margin-top', '0.8em'])
      props.push(['margin-bottom', '0.8em'])
    }

    if (!hasCssProp(styleText, 'color')) {
      props.push(['color', defaultTextColor])
    }

    return props
  })

  next = replaceOpeningTag(next, 'a', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    if (!hasCssProp(styleText, 'color')) {
      props.push(['color', defaultLinkColor])
    }
    if (!hasCssProp(styleText, 'text-decoration')) {
      props.push(['text-decoration', 'underline'])
    }
    if (!hasCssProp(styleText, 'word-break')) {
      props.push(['word-break', 'break-word'])
    }
    return props
  })

  next = replaceOpeningTag(next, 'ul', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    const hasAnyMargin =
      hasCssProp(styleText, 'margin') ||
      hasCssProp(styleText, 'margin-top') ||
      hasCssProp(styleText, 'margin-bottom')
    if (!hasAnyMargin) {
      props.push(['margin-top', '0.8em'])
      props.push(['margin-bottom', '0.8em'])
    }
    if (!hasCssProp(styleText, 'padding-left')) {
      props.push(['padding-left', '1.2em'])
    }
    return props
  })

  next = replaceOpeningTag(next, 'ol', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    const hasAnyMargin =
      hasCssProp(styleText, 'margin') ||
      hasCssProp(styleText, 'margin-top') ||
      hasCssProp(styleText, 'margin-bottom')
    if (!hasAnyMargin) {
      props.push(['margin-top', '0.8em'])
      props.push(['margin-bottom', '0.8em'])
    }
    if (!hasCssProp(styleText, 'padding-left')) {
      props.push(['padding-left', '1.2em'])
    }
    return props
  })

  next = replaceOpeningTag(next, 'li', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    if (!hasCssProp(styleText, 'line-height')) {
      props.push(['line-height', '1.6'])
    }
    const hasAnyMargin =
      hasCssProp(styleText, 'margin') ||
      hasCssProp(styleText, 'margin-top') ||
      hasCssProp(styleText, 'margin-bottom')
    if (!hasAnyMargin) {
      props.push(['margin-top', '0.4em'])
      props.push(['margin-bottom', '0.4em'])
    }
    if (!hasCssProp(styleText, 'color')) {
      props.push(['color', defaultTextColor])
    }
    return props
  })

  next = replaceOpeningTag(next, 'blockquote', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    const hasAnyMargin =
      hasCssProp(styleText, 'margin') ||
      hasCssProp(styleText, 'margin-top') ||
      hasCssProp(styleText, 'margin-bottom')
    if (!hasAnyMargin) {
      props.push(['margin-top', '0.8em'])
      props.push(['margin-bottom', '0.8em'])
    }
    if (!hasCssProp(styleText, 'padding-left')) {
      props.push(['padding-left', '0.8em'])
    }
    if (!hasCssProp(styleText, 'border-left')) {
      props.push(['border-left', `3px solid ${defaultLinkColor}`])
    }
    if (!hasCssProp(styleText, 'color')) {
      props.push(['color', defaultSecondaryTextColor])
    }
    return props
  })

  next = replaceOpeningTag(next, 'pre', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    if (!hasCssProp(styleText, 'background-color')) {
      props.push(['background-color', defaultCodeBg])
    }
    if (!hasCssProp(styleText, 'padding')) {
      props.push(['padding', '0.8em'])
    }
    if (!hasCssProp(styleText, 'border-radius')) {
      props.push(['border-radius', '8px'])
    }
    if (!hasCssProp(styleText, 'overflow-x')) {
      props.push(['overflow-x', 'auto'])
    }
    if (!hasCssProp(styleText, 'white-space')) {
      props.push(['white-space', 'pre-wrap'])
    }
    if (!hasCssProp(styleText, 'word-break')) {
      props.push(['word-break', 'break-word'])
    }
    if (!hasCssProp(styleText, 'line-height')) {
      props.push(['line-height', '1.6'])
    }
    if (!hasCssProp(styleText, 'color')) {
      props.push(['color', defaultTextColor])
    }
    return props
  })

  next = replaceOpeningTag(next, 'code', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    if (!hasCssProp(styleText, 'background-color')) {
      props.push(['background-color', defaultCodeBg])
    }
    if (!hasCssProp(styleText, 'padding')) {
      props.push(['padding', '0 0.2em'])
    }
    if (!hasCssProp(styleText, 'border-radius')) {
      props.push(['border-radius', '4px'])
    }
    if (!hasCssProp(styleText, 'color')) {
      props.push(['color', defaultTextColor])
    }
    return props
  })

  next = replaceOpeningTag(next, 'hr', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    if (!hasCssProp(styleText, 'border')) {
      props.push(['border', 'none'])
    }
    if (!hasCssProp(styleText, 'border-top')) {
      props.push(['border-top', `1px solid ${defaultBorderColor}`])
    }
    const hasAnyMargin =
      hasCssProp(styleText, 'margin') ||
      hasCssProp(styleText, 'margin-top') ||
      hasCssProp(styleText, 'margin-bottom')
    if (!hasAnyMargin) {
      props.push(['margin-top', '1em'])
      props.push(['margin-bottom', '1em'])
    }
    return props
  })

  next = replaceOpeningTag(next, 'table', (match, attrs) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    if (!hasCssProp(styleText, 'width')) {
      props.push(['width', '100%'])
    }
    if (!hasCssProp(styleText, 'border-collapse')) {
      props.push(['border-collapse', 'collapse'])
    }
    if (!hasCssProp(styleText, 'table-layout')) {
      props.push(['table-layout', 'fixed'])
    }
    return props
  })

  const cellStyle = (attrs, isHeader) => {
    const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
    const m = attrs.match(styleAttrReg)
    const styleText = m ? (m[1] ?? m[2] ?? '') : ''

    const props = []
    if (!hasCssProp(styleText, 'border')) {
      props.push(['border', `1px solid ${defaultBorderColor}`])
    }
    if (!hasCssProp(styleText, 'padding')) {
      props.push(['padding', '0.5em'])
    }
    if (!hasCssProp(styleText, 'word-break')) {
      props.push(['word-break', 'break-word'])
    }
    if (!hasCssProp(styleText, 'color')) {
      props.push(['color', defaultTextColor])
    }
    if (isHeader && !hasCssProp(styleText, 'font-weight')) {
      props.push(['font-weight', '600'])
    }
    return props
  }

  next = replaceOpeningTag(next, 'td', (match, attrs) => cellStyle(attrs, false))
  next = replaceOpeningTag(next, 'th', (match, attrs) => cellStyle(attrs, true))

  const textTags = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  for (const tag of textTags) {
    next = replaceOpeningTag(next, tag, (match, attrs) => {
      const styleAttrReg = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i
      const m = attrs.match(styleAttrReg)
      const styleText = m ? (m[1] ?? m[2] ?? '') : ''
      if (hasCssProp(styleText, 'color')) return []
      return [['color', defaultTextColor]]
    })
  }

  return next
}

// 兼容历史调用
export const htmlReplace = htmlParse
