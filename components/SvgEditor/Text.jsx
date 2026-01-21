import { toast } from '@/duxapp'
import { duxuiLang } from '@/duxui/utils'
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
    title: duxuiLang.t('svg.editor.textInputTitle'),
    content: <Column className='p-3'>
      <Input placeholder={duxuiLang.t('svg.editor.textPlaceholder')} align='center' className='text-s7' focus onChange={e => text = e} />
    </Column>
  })) {
    if (!text) {
      toast(duxuiLang.t('svg.editor.pleaseInputContent'))
      throw new Error(duxuiLang.t('svg.editor.notInput'))
    }
    return text
  } else {
    throw new Error(duxuiLang.t('svg.editor.cancelInput'))
  }
}
