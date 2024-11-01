import { View } from "@tarojs/components"
import classNames from "classnames"
import tags from '../../../utils/tags.json'
import './Header.scss'

// tag替换正则
const tagReg = /&([a-zA-Z0-9]{1,});/g

export const Header = ({ data = {}, tunes }) => {
  return <View
    className={classNames('LEV-Header', 'LEV-Header--' + data.level, 'text-' + (tunes?.AlignmentTuneTool?.alignment || 'left'))}
  >{data.text?.replace?.(tagReg, (a, b) => tags[b] || a) || ''}</View>
}
