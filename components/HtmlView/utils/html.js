export const htmlReplace = html => {
  if (typeof html === 'string') {
    return html
      .replace(/<img/g, '<img style="max-width:100%;height:auto;display:block;" ')
      .replace(/section/g, 'div')
  } else {
    return ''
  }
}
