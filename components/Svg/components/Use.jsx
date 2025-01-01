export const Use = () => {

  return null
}

Use.displayName = 'DuxSvgUse'

Use.draw = (ctx, { href = '', x = 0, y = 0, ...props }, { defs }) => {
  const id = href.slice(1)

  if (x || y) {
    ctx.save()
    ctx.translate(x, y)
  }
  const res = defs[id]?.({
    props
  })
  if (x || y) {
    ctx.restore()
  }
  return res
}
