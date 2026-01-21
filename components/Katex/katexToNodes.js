import katex from 'katex'

const uppercase = /([A-Z])/g
const hyphenate = str => str.replace(uppercase, '-$1').toLowerCase()

const ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;'
}

const ESCAPE_REGEX = /[&><"']/g

function escape(text) {
  return String(text).replace(ESCAPE_REGEX, match => ESCAPE_LOOKUP[match])
}

const svgToDataUri = svg => {
  const txt = encodeURIComponent(String(svg).replace(/\s+/g, ' '))
  return 'data:image/svg+xml;utf8,' + txt
}

const createClass = classes => classes?.filter(cls => cls).join(' ') ?? ''

const katex2richnode = (type, dom, children, color) => {
  let needsSpan = false
  if (dom.classes && dom.classes.length > 0) needsSpan = true

  const classes = escape(createClass(dom.classes))
  let styles = ''

  if (type === 'text') {
    if (dom.italic > 0) {
      styles += 'margin-right:' + dom.italic + 'em;'
    }
  }

  for (const style in dom.style) {
    if (Object.prototype.hasOwnProperty.call(dom.style, style)) {
      styles += `${hyphenate(style)}:${dom.style[style]};`
    }
  }

  if (color) {
    styles += `color:${color};`
    needsSpan = true
  }

  if (styles) {
    needsSpan = true
  }

  const attrs = {}
  for (const attr in dom.attributes) {
    if (Object.prototype.hasOwnProperty.call(dom.attributes, attr)) {
      attrs[attr] = escape(dom.attributes[attr])
    }
  }

  if (type === 'span') {
    return {
      name: 'span',
      attrs: {
        class: classes + ' katex-span',
        style: styles
      },
      children
    }
  }

  if (type === 'text') {
    const escaped = escape(dom.text)
    if (needsSpan) {
      return {
        name: 'span',
        attrs: {
          class: classes,
          style: styles
        },
        children: [{ type: 'text', text: escaped }]
      }
    }
    return { type: 'text', text: escaped }
  }

  if (type === 'svg') {
    const svg = dom.toMarkup()
    return {
      name: 'img',
      attrs: {
        src: svgToDataUri(svg),
        class: 'katex-svg'
      }
    }
  }

  return null
}

const toMarkup = (doms, color) => {
  return doms
    .map(dom => {
      let domColor = color
      if (dom?.style?.color) domColor = dom.style.color

      let type
      if (dom instanceof katex.__domTree.Span) type = 'span'
      if (dom instanceof katex.__domTree.Anchor) type = 'anchor'
      if (dom instanceof katex.__domTree.LineNode) type = 'line'
      if (dom instanceof katex.__domTree.PathNode) type = 'path'
      if (dom instanceof katex.__domTree.SvgNode) {
        type = 'svg'
        if (domColor) dom.attributes.fill = domColor
      }
      if (dom instanceof katex.__domTree.SymbolNode) type = 'text'

      const children = dom.children && dom.children.length > 0 ? toMarkup(dom.children, domColor) : []
      if (!type) return children
      return katex2richnode(type, dom, children, domColor)
    })
    .reduce((pre, item) => {
      if (Array.isArray(item)) {
        pre.push(...item)
      } else {
        pre.push(item)
      }
      return pre
    }, [])
    .filter(i => !!i)
}

export const latexParse = (latex, option = {}, color) => {
  const { throwError, ...restOption } = option || {}
  try {
    const tree = katex.__renderToDomTree(latex, {
      ...restOption,
      output: 'html'
    })
    return toMarkup([tree], color)
  } catch (error) {
    if (throwError) throw error
    return [
      {
        name: 'span',
        attrs: { style: 'color:red;' },
        children: [{ type: 'text', text: error.message }]
      }
    ]
  }
}

