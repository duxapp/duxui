import { toast } from '@/duxapp'
import { Rect, SvgComponent } from '../Svg'
import { Column } from '../Flex'
import { Input } from '../Form'
import { confirm } from '../Interact'
import { getKey } from './util'

export const TextInput = ({ onSubmit, ...props }) => {

  const startInput = async e => {
    const { locationX, locationY } = e.nativeEvent

    const text = await inputText()

    onSubmit({
      type: 'Text',
      attr: {
        ...props,
        x: locationX,
        y: locationY,
        children: text
      },
      key: getKey()
    })
  }

  return <SvgComponent>
    <Rect
      width='100%'
      height='100%'
      fill='none'
      onPress={startInput}
    />
  </SvgComponent>
}

const inputText = async () => {
  let text = ''
  if (await confirm({
    title: '文本输入',
    content: <Column className='p-3'>
      <Input placeholder='请输入文本' align='center' className='text-s7' focus onChange={e => text = e} />
    </Column>
  })) {
    if (!text) {
      toast('请输入内容')
      throw new Error('未输入')
    }
    return text
  } else {
    throw new Error('取消输入')
  }
}
