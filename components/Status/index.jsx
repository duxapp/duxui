import classNames from 'classnames'
import { View } from '../common/View'
import { Incline } from './Incline'
import { Common } from './Common'
import { context, useStatusContext } from './util'

export const Status = ({ children, horizontal = 'left', vertical = 'top', status, style, className, ...props }) => {

  return <context.Provider value={{ horizontal, vertical, className: classNames('absolute', horizontal + '-0', vertical + '-0') }}>
    {
      children ?
        <View style={style} {...props} className={classNames('overflow-hidden', className)}>
          {children}
          {status}
        </View> :
        status
    }
  </context.Provider>
}

Status.Incline = Incline
Status.Common = Common

export { useStatusContext }
