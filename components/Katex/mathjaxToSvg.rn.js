import { version } from 'mathjax-full/package.json'
import { mathjax } from 'mathjax-full/js/mathjax'
import { TeX } from 'mathjax-full/js/input/tex'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'
import { SVG } from 'mathjax-full/js/output/svg'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html'

// fix https://github.com/mathjax/MathJax-src/issues/818
global.PACKAGE_VERSION = global.PACKAGE_VERSION || version

const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)

export const mathjaxDefaultConfig = {
  inline: true,
  displayAlign: 'center',
  em: 16,
  ex: 8,
  width: 80 * 16,
  packages: AllPackages,
  macros: {},
  environments: {},
  fontCache: 'none',
  inlineMath: [['$', '$'], ['\\(', '\\)']],
  displayMath: [['$$', '$$'], ['\\[', '\\]']]
}

const docCache = new Map()

function normalizeConfig(config) {
  const input = config || {}
  return {
    ...mathjaxDefaultConfig,
    ...input,
    macros: { ...mathjaxDefaultConfig.macros, ...(input.macros || {}) },
    environments: { ...mathjaxDefaultConfig.environments, ...(input.environments || {}) }
  }
}

function getDoc(partialConfig) {
  const config = normalizeConfig(partialConfig)

  const key = JSON.stringify({
    displayAlign: config.displayAlign,
    packages: config.packages,
    macros: config.macros,
    environments: config.environments,
    inlineMath: config.inlineMath,
    displayMath: config.displayMath,
    fontCache: config.fontCache
  })

  const cached = docCache.get(key)
  if (cached) return { ...cached, config }

  const tex = new TeX({
    packages: config.packages,
    macros: config.macros,
    environments: config.environments,
    inlineMath: config.inlineMath,
    displayMath: config.displayMath
  })

  const fontCache =
    config.fontCache === true ? 'local'
      : config.fontCache === false ? 'none'
        : config.fontCache

  const svg = new SVG({
    fontCache,
    displayAlign: config.displayAlign
  })

  const doc = mathjax.document('', { InputJax: tex, OutputJax: svg })

  const value = { doc, config }
  docCache.set(key, value)
  return value
}

function parseSize(value, { em, ex }) {
  if (typeof value === 'number') return value
  if (!value) return 0
  const str = String(value).trim()

  const unit = str.slice(-2)
  const n = parseFloat(str)
  if (Number.isNaN(n)) return 0

  switch (unit) {
    case 'em':
      return n * em
    case 'ex':
      return n * ex
    case 'px':
      return n
    case 'pt':
      return n * (96 / 72)
    default:
      return n
  }
}

function patchSvgColor(svg, color) {
  if (!color) return svg
  if (/\scolor="[^"]*"/.test(svg)) {
    return svg.replace(/\scolor="[^"]*"/, ` color="${color}"`)
  }
  return svg.replace('<svg', `<svg color="${color}"`)
}

function normalizeSvgXml(svg) {
  const xml = String(svg)
    .replace(/xlink:xlink/g, 'xlink')
    // react-native-svg / browser 对 xlink:href 兼容不一致，统一成 href
    .replace(/xlink:href=/g, 'href=')

  // 只移除根 <svg> 的 width/height，避免误删内部元素（根号横线/分数线等）
  return xml.replace(/<svg\b([^>]*)>/, (match, attrs) => {
    const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, '')
    return `<svg${cleaned}>`
  })
}

export function mathjaxToSvg(math, partialConfig, { color, scale = 1 } = {}) {
  const { doc, config } = getDoc(partialConfig)
  const node = doc.convert(String(math || ''), {
    display: !config.inline,
    em: config.em,
    ex: config.ex,
    containerWidth: config.width
  })

  const svgNode = node?.kind === 'svg' ? node : adaptor.firstChild(node)
  if (!svgNode) {
    throw new Error('MathJax 输出为空')
  }

  const width = parseSize(adaptor.getAttribute(svgNode, 'width'), config)
  const height = parseSize(adaptor.getAttribute(svgNode, 'height'), config)

  const svg = patchSvgColor(normalizeSvgXml(adaptor.outerHTML(svgNode)), color)

  return {
    svg,
    size: {
      width: Math.max(0, width * scale),
      height: Math.max(0, height * scale)
    }
  }
}
