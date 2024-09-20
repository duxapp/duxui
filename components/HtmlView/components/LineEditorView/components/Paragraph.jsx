import { useMemo, createElement } from 'react'
import { px } from '@/duxapp'
import classNames from 'classnames'
import { Text } from '@tarojs/components'
import { HTMLParser } from '../../../utils/htmlparser'
import tags from '../../../utils/tags.json'
import './Paragraph.scss'

const renderNode = nodes => {
  return nodes.map(item => {
    if (typeof item === 'string') {
      return item
    }
    const { child, className, ...props } = item
    return createElement(Text, { ...props, className: classNames(className, props.class) }, child?.length ? renderNode(child) : null)
  })
}

export const Paragraph = ({ data, tunes }) => {
  const { nodes } = useMemo(() => getNodes(data.text), [data.text])
  return <Text className={classNames('LEV-Paragraph', 'text-' + (tunes?.AlignmentTuneTool?.alignment || 'left'))}>
    {renderNode(nodes)}
  </Text>
}

const getNodes = (() => {

  // 样式名称转换
  const styleNameTransforms = [
    ['textDecoration'],
    ['textDecorationLine'],
  ]
  // 不支持的Style属性
  const noStyleValue = ['auto', 'normal']

  // tag替换正则
  const tagReg = /&([a-zA-Z0-9]{1,});/g

  // 空字符过滤
  const emptyTexts = ['\r', '\n', '\r\n', '↵']

  // 转换尺寸单位
  const getSize = value => {
    if (value?.endsWith('px')) {
      return px(value.replace('px', '') * 2)
    } else if (value?.endsWith('pt')) {
      return px(value.replace('pt', '') * 2 * 1.33333)
    } else if (value?.endsWith('rem')) {
      return px(value.replace('rem', '') * 32)
    } else if (value?.endsWith('em')) {
      return px(value.replace('em', '') * 32)
    }
    return false
  }

  // 转换样式
  const getStyleValue = (name, value) => {
    const size = getSize(value)
    if (size !== false) {
      return [name, size]
    }
    if (name === 'lineHeight') {
      // rn不支持倍数行高
      return false
    } else if (name === 'zIndex') {
      return [name, +value]
    }
    return [name, value]
  }
  const getAttrs = (tag, attrs) => {

    const data = {
      className: `html-${tag}`
    }
    attrs.forEach(({ name, value }) => {
      switch (name) {
        case 'style': {
          const res = value.replace(/ /g, '').split(';').map(item => {
            const arr = item.split(':')
            // 排除无效或者为空的Style
            if (!arr[0] || noStyleValue.includes(arr[1])) {
              return false
            }
            let styleName = arr[0].split('-').map((v, i) => {
              if (i === 0) {
                return v
              }
              return v[0].toUpperCase() + v.substr(1)
            }).join('')

            // 样式名称转换，支持rn
            const transformIndex = styleNameTransforms[0].indexOf(styleName)
            if (~transformIndex) {
              styleName = styleNameTransforms[1][transformIndex]
            }

            return getStyleValue(styleName, arr[1])
          }).filter(v => v)
          data.style = Object.fromEntries(res)
          break
        }
        default: {
          data[name] = value
          break
        }
      }
    })
    return data
  }
  return html => {

    const images = []

    const bufArray = []
    const results = {
      child: []
    }
    HTMLParser(html, {
      start(tag, attrs, unary) {
        const node = {
          ...getAttrs(tag, attrs),
          // key: getKey()
        }
        if (node.nodeName === 'Image' && node.src) {
          images.push(node.src)
        }
        if (unary) {
          // if this tag dosen't have end tag
          // like <img src="hoge.png"/>
          // add to parents
          const parent = bufArray[0] || results;
          if (parent.child === undefined) {
            parent.child = [];
          }
          parent.child.push(node)
        } else {
          bufArray.unshift(node)
        }
      },
      chars(text) {
        if (emptyTexts.includes(text)) {
          return
        }
        text = text.replace(tagReg, (a, b) => tags[b] || a)
        if (bufArray.length === 0) {
          results.child.push(text)
        } else {
          const parent = bufArray[0];
          if (parent.child === undefined) {
            parent.child = []
          }
          parent.child.push(text)
        }
      },
      end(tag) {
        const node = bufArray.shift()
        // if (node.tag !== tag) console.error('invalid state: mismatch end tag');
        //判断子元素中是否存在不属于文本的元素
        if (node.nodeName === 'Text' && node.child?.some(v => !(typeof v === 'string' || v.nodeName === 'Text') || v.childOther)) {
          node.childOther = true
        }
        if (bufArray.length === 0) {
          results.child.push(node)
        } else {
          var parent = bufArray[0]
          if (parent.child === undefined) {
            parent.child = []
          }
          parent.child.push(node)
        }
      },
      comment(text) {
        console.log('comment', text)
      }
    })
    return {
      nodes: results.child,
      images
    }
  }
})();
