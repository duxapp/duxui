import { px } from '@/duxapp'
import { Column } from '../../Flex'
import { Form } from '../../Form/Form'
import { Range, Color, FillRadio } from './Common'

const StrokeFrom = ({ addMenu }) => {
  return <>
    <Form.Item field='strokeWidth'>
      <Range max={16} name='粗细' />
    </Form.Item>
    <MenuLine />
    <Form.Item field='stroke'>
      <Color addMenu={addMenu} />
    </Form.Item>
  </>
}

const PathMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <StrokeFrom addMenu={addMenu} />
  </Form>
}

const TextMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <Form.Item field='fill'>
      <Color addMenu={addMenu} />
    </Form.Item>
    <MenuLine />
    <Form.Item field='fontSize'>
      <Range min={12} max={64} name='字号' />
    </Form.Item>
  </Form>
}

const RectMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <StrokeFrom addMenu={addMenu} />
    <MenuLine />
    <Form.Item field='isFill'>
      <FillRadio />
    </Form.Item>
  </Form>
}

const EllipseMenu = ({ defaultValues, onChange, addMenu }) => {
  return <Form defaultValues={defaultValues} onChange={onChange}>
    <StrokeFrom addMenu={addMenu} />
    <MenuLine />
    <Form.Item field='isFill'>
      <FillRadio />
    </Form.Item>
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
