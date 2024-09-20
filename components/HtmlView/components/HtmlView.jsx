import { useCallback, useEffect, useMemo, useRef, useState, cloneElement } from 'react'
import { previewImageUtil } from '@tarojs/taro'
import { View as TaroView, Text as TaroText, Image as TaroImage, Video as TaroVideo } from '@tarojs/components'
import { Layout, px } from '@/duxapp'
import { HTMLParser } from '../utils/htmlparser'
import tags from '../utils/tags.json'
import './HtmlView.css'

const Image = ({ style, className, src, containerLayout, onClick }) => {

  const click = useCallback(() => {
    onClick?.({
      type: 'image',
      src
    })
  }, [onClick])

  return <TaroImage
    style={{ width: containerLayout.width + (process.env.TARO_ENV === 'rn' ? 0 : 'px'), ...style }}
    className={className}
    src={src}
    mode='widthFix'
    onClick={click}
  />
}

const Video = ({ style, className, src, controls, containerLayout, children }) => {

  const [childSrc, setChildSrc] = useState('')

  useEffect(() => {
    // 查找src
    if (!src) {
      const res = children.filter(v => v.props?.src)?.[0]?.props?.src
      res && setChildSrc(res)
    }
  }, [src, children])

  const isPlay = useMemo(() => !!childSrc || !!src, [childSrc, src])

  return isPlay ?
    <TaroVideo
      style={{
        width: containerLayout.width + (process.env.TARO_ENV === 'rn' ? 0 : 'px'),
        height: containerLayout.width * 9 / 16 + (process.env.TARO_ENV === 'rn' ? 0 : 'px'),
        ...style
      }}
      className={className}
      controls={!!controls}
      src={childSrc || src}
    />
    : null
}

const Audio = ({ src, autoplay, loop }) => {

  return <TaroView className='html-audio'>

  </TaroView>
}

const getTextStyle = (allStyle = {}) => {
  const textStyles = ['opacity', 'backgroundColor', 'color', 'fontSize', 'lineHeight', 'fontWeight', 'fontFamily', 'fontStyle', 'letterSpacing', 'textAlign', 'textDecorationLine', 'textTransform']
  const style = {}
  const textStyle = {}
  for (let key in allStyle) {
    if (typeof allStyle[key] == 'object') {
      for (let key1 in allStyle[key]) {
        if (textStyles.includes(key1)) {
          style[key1] = allStyle[key][key1]
        } else {
          textStyle[key1] = allStyle[key][key1]
        }
      }
    } else {
      if (textStyles.includes(key)) {
        style[key] = allStyle[key]
      } else {
        textStyle[key] = allStyle[key]
      }
    }
  }
  return [style, textStyle]
}

const View = ({
  children,
  style = {},
  className,
  onClick,
  ...props
}) => {
  const [viewStyle, textStyle] = useMemo(() => getTextStyle(style), [style])
  // 判断内容是否是纯文本 或者是否是 文本组件
  const isText = useMemo(() => children?.every?.(item => typeof item === 'string'), [children])
  // 是否是纯文本组件
  const isTextComp = useMemo(() => !isText && children?.every?.(item => item?.props?.nodeName === 'Text'), [isText, children])

  return isText ? (
    <TextPlatform
      style={viewStyle}
      className={className}
      onClick={() => {
        // 一般 a 链接才有这个
        if (props.href) {
          onClick({ type: 'link', ...props });
        }
      }}
    >
      {children.join('')}
    </TextPlatform>
  ) :
    isTextComp ?
      <TextPlatform style={textStyle} className={className}>{children}</TextPlatform> :
      <TaroView
        style={viewStyle}
        className={className}
        onClick={() => {
          // 一般 a 链接才有这个
          if (props.href) {
            onClick({ type: 'link', ...props });
          }
        }}
      >
        {
          children?.map?.((item, index) => {
            return typeof item === 'string' ?
              <TextPlatform key={index} style={textStyle}>{item}</TextPlatform> :
              item
          }) || children
        }
      </TaroView>
}

const TextPlatform = ({
  children,
  style,
  className,
  ...props
}) => {
  if (!children) {
    return null
  }
  return process.env.TARO_ENV === 'weapp' ?
    <TaroView className={`html-text ${className || ''}`} style={style} {...props}>
      {children}
    </TaroView> :
    <TaroText className={className} style={style} {...props}>
      {children}
    </TaroText>
}

const Text = ({
  children,
  style = {},
  childOther,
  className
}) => {
  // 如果子元素里面是纯文本就是组件形式渲染，否则省略当前层级然他正常渲染
  return !childOther ?
    <TextPlatform style={style} className={className}>
      {
        children?.map?.((item, index) => {
          return typeof item === 'string' ?
            <TextPlatform style={style} className={className} key={index}>{item}</TextPlatform> :
            item
        }) || children
      }
    </TextPlatform> :
    (children?.map?.((item, index) => {
      return typeof item === 'string' ?
        <TextPlatform style={style} className={className} key={index}>{item}</TextPlatform> :
        cloneElement(item, { style: { ...item.props.style, ...style }, className: `${item.props.className || ''} ${className || ''}` })
    }) || children)

}

const comps = {
  View,
  Text,
  Image,
  Video
}

const Item = ({
  nodeName,
  child,
  children,
  containerLayout,
  onClick,
  ...props
}) => {
  const Comp = useMemo(() => comps[nodeName] || comps.View, [nodeName])
  return <Comp containerLayout={containerLayout} onClick={onClick} {...props}>
    {
      child?.map(item => {
        if (typeof item === 'string') {
          return item
        }
        return <Item key={item.key} {...item} onClick={onClick} containerLayout={containerLayout} />
      })
    }
  </Comp>
}

const Create = ({ nodes, containerLayout, onClick, ...props }) => {
  return <View {...props}>
    {
      nodes?.map(item => {
        if (typeof item === 'string') {
          return item
        }
        return <Item key={item.key} {...item} onClick={onClick} containerLayout={containerLayout} />
      })
    }
  </View>
}

export function HtmlView({
  html,
  style,
  className,
  previewImage,
  onLinkClick
}) {

  const [nodes, setNodes] = useState([])

  const images = useRef([])

  const [containerLayout, setContainerLayout] = useState({
    width: 375
  })

  useEffect(() => {
    try {
      const { nodes, images: imgs } = getNodes(html)
      setNodes(nodes)
      images.current = imgs
    } catch (error) {
      console.error('html解析失败', error)
    }
  }, [html])

  const layout = useCallback((e) => {
    setContainerLayout(e)
  }, [])

  const click = useCallback(e => {
    //console.log('click', e);
    if (e.type === 'image' && previewImage) {
      previewImageUtil({
        current: e.src,
        urls: images.current
      })
    }
    if (e.type === 'link' && onLinkClick) {
      onLinkClick(e.href);
    }
  }, [nodes])

  return <Layout onLayout={layout} style={{ ...process.env.TARO_ENV === 'h5' ? { fontSize: '16px' } : {}, ...style }} className={className}>
    <Create nodes={nodes} containerLayout={containerLayout} onClick={click} />
  </Layout>
}

const getNodes = (() => {
  const nodeArr = {
    img: 'Image',
    video: 'Video'
  }
  'span,font,b,strong,i,em,u,sup,sub,h1,h2,h3,h4,h5,h6,font,q,s,strike,del,big,small'.split(',').forEach(key => {
    nodeArr[key] = 'Text'
  })
  /**
   * 定义节点支持的style
   */
  const styleNode = {
    // 布局组件通用
    View: ['width', 'height', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'opacity', 'backgroundColor', 'overflow', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderStyle', 'borderWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth', 'borderColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'borderBottomColor', 'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'position', 'left', 'right', 'top', 'bottom', 'zIndex', 'flexDirection', 'flexWrap', 'alignItems', 'justifyContent', 'alignContent', 'flex', 'flexGrow', 'flexShrink', 'alignSelf', 'color', 'fontSize', 'lineHeight', 'fontWeight', 'fontFamily', 'fontStyle', 'letterSpacing', 'textAlign', 'textDecorationLine', 'textTransform', 'textIndent'],
    // 文本 输入框类组件通用
    Text: ['width', 'height', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'opacity', 'backgroundColor', 'overflow', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderStyle', 'borderWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth', 'borderColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'borderBottomColor', 'position', 'left', 'right', 'top', 'bottom', 'zIndex', 'color', 'fontSize', 'lineHeight', 'fontWeight', 'fontFamily', 'fontStyle', 'letterSpacing', 'textAlign', 'textDecorationLine', 'textTransform', 'textIndent', 'flex', 'flexGrow', 'flexShrink', 'alignSelf'],
    // 图片专用
    Image: ['width', 'height', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'opacity', 'backgroundColor', 'overflow', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderStyle', 'borderWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth', 'borderColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'borderBottomColor', 'position', 'left', 'right', 'top', 'bottom', 'zIndex', 'flex', 'flexGrow', 'flexShrink', 'alignSelf'],
    Video: ['width', 'height', 'backgroundColor', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom']
  }
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
      nodeName: nodeArr[tag] || 'View',
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

            // 排除不支持的Style
            if (!styleNode[data.nodeName].includes(styleName)) {
              return false
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
  let key = 0
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
          key: ++key
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
