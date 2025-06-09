import { px } from '@/duxapp'
import { Column } from '../../Flex'
import { Form, FormItem } from '../../Form/Form'
import { Range, Color, FillRadio } from './Common'

const StrokeFrom = ({ addMenu }) => {
  return <>
    <FormItem field='strokeWidth'>
      <Range max={16} name='粗细' />
    </FormItem>
    <MenuLine />
    <FormItem field='stroke'>
      <Color addMenu={addMenu} />
    </FormItem>
  </>
}

const PathMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <StrokeFrom addMenu={addMenu} />
  </Form>
}

const TextMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <FormItem field='fill'>
      <Color addMenu={addMenu} />
    </FormItem>
    <MenuLine />
    <FormItem field='fontSize'>
      <Range min={12} max={64} name='字号' />
    </FormItem>
  </Form>
}

const RectMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <StrokeFrom addMenu={addMenu} />
    <MenuLine />
    <FormItem field='isFill'>
      <FillRadio />
    </FormItem>
  </Form>
}

const EllipseMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <StrokeFrom addMenu={addMenu} />
    <MenuLine />
    <FormItem field='isFill'>
      <FillRadio />
    </FormItem>
  </Form>
}

const LineMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <StrokeFrom addMenu={addMenu} />
  </Form>
}

export const menus = {
  path: PathMenu,
  text: TextMenu,
  rect: RectMenu,
  ellipse: EllipseMenu,
  line: LineMenu
}

export const MenuLine = () => {
  return <Column className='flex-shrink' style={{ height: px(36), width: 1, backgroundColor: '#e8e8e8' }} />
}
