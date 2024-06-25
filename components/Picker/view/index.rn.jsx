import { Component } from 'react'
import { View } from 'react-native'
import AntPickerView from './rn/PickerView'

export class PickerView extends Component {
  static defaultProps = {
    data: [],
    value: []
  }

  onChange = (val) => {
    const { onChange } = this.props
    onChange?.({ detail: { value: val } })
  }

  handleChildren = (children) => {
    return children.map((child, index) => {
      return {
        label: this.getLabelFromChildren(child),
        value: index
      }
    })
  }

  joinString = (data) => {
    return (Array.isArray(data) ? data : [data]).join('')
  }

  getLabelFromChildren = (child) => {
    return child.props && child.props.children ? this.getLabelFromChildren(child.props.children) : this.joinString(child)
  }

  getDataFromChildren = (children) => {
    return (Array.isArray(children) ? children : [children]).map((child) => {
      return this.handleChildren(child.props && child.props.children ? child.props.children : [child])
    })
  }

  render() {
    const { data, value, children, ...restProps } = this.props
    if (!children) return null
    return (
      <AntPickerView
        {...restProps}
        value={value}
        data={data.length > 0 ? data : this.getDataFromChildren(children)}
        onChange={this.onChange}
        cascade={false}
      />
    )
  }
}

export const PickerViewColumn = props => {
  return <View {...props} />
}
