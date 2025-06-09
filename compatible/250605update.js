/* eslint-disable import/no-commonjs */
const file = require('duxapp-cli/lib/file')

const map = [
  ['Avatar.Group', 'AvatarGroup'],
  ['Card.Title', 'CardTitle'],
  ['CardSelect.Group', 'CardSelectGroup'],
  ['Cell.Group', 'CellGroup'],
  ['Divider.Group', 'DividerGroup'],
  ['Elevator.Search', 'ElevatorSearch'],
  ['Checkbox.Group', 'CheckboxGroup'],
  ['Form.Item', 'FormItem'],
  ['Form.Submit', 'FormSubmit'],
  ['Form.Reset', 'FormReset'],
  ['Form.Object', 'FormObject'],
  ['Form.Array', 'FormArray'],
  ['Form.ArrayAction', 'FormArrayAction'],
  ['Form.useFormContext', 'useFormContext'],
  ['Form.useFormItemProxy', 'useFormItemProxy'],
  ['Input.Search', 'InputSearch'],
  ['Recorder.start', 'recorderStart'],
  ['Radio.Group', 'RadioGroup'],
  ['Image.Group', 'ImageGroup'],
  ['LicensePlate.Keyboard', 'LicensePlateKeyboard'],
  ['LicensePlate.Input', 'LicensePlateInput'],
  ['LicensePlate.Provider', 'LicensePlateProvider'],
  ['LicensePlate.context', 'LicensePlateContext'],
  ['Menu.Item', 'MenuItem'],
  ['NumberKeyboard.useController', 'useNumberKeyboardController'],
  ['Status.Common', 'StatusCommon'],
  ['Status.Incline', 'StatusIncline'],
  ['SvgEditorController.useController', 'useSvgEditorController'],
  ['Swiper.Item', 'SwiperItem'],
  ['Tab.Item', 'TabItem']
]

// 帮助函数：查找导入块，返回数组，元素为
// {start, end, text, specifiers: ['A', 'B'], source: "'@/duxui'", isMultiline: boolean, originalText}
function parseImportBlocks(content) {
  const importRegex = /import\s+{([^}]+)}\s+from\s+(['"])([^'"]+)\2/g
  const blocks = []
  let match
  while ((match = importRegex.exec(content)) !== null) {
    const fullMatch = match[0]
    const specifiersRaw = match[1]
    const quote = match[2]
    const source = match[3]
    const start = match.index
    const end = match.index + fullMatch.length
    const isMultiline = specifiersRaw.includes('\n')
    // 解析导入符号
    let specifiers = specifiersRaw.split(',').map(s => s.trim()).filter(Boolean)
    blocks.push({ start, end, text: fullMatch, specifiers, source, quote, isMultiline, originalText: fullMatch })
  }
  return blocks
}

// 判断一个组件或函数所属模块导入块索引
// 规则：组件或函数前半部分是模块名（如 Avatar.Group -> Avatar, NumberKeyboard.useController -> NumberKeyboard）
// 如果模块名在某导入块的specifiers中，返回该导入块索引
function findImportBlockIndexByModule(blocks, moduleName) {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].specifiers.includes(moduleName)) {
      return i
    }
  }
  return -1
}

// 用于替换jsx标签
function replaceJsxTags(content, map) {
  // 匹配标签的开始和结束标签： <AvatarGroup ...> 和 </AvatarGroup>
  // 处理所有map的标签替换
  for (const [oldName, newName] of map) {
    if (!oldName.includes('.')) continue // 函数替换不处理这里
    // 拆分旧标签：如 Avatar.Group => tag='Avatar', sub='Group'
    const [tag, sub] = oldName.split('.')
    if (!tag || !sub) continue
    // 创建正则，替换开标签 <AvatarGroup ...> 为 <AvatarGroup ...>
    const openTagRegex = new RegExp(`(<)${tag}\\.${sub}(\\s|>)`, 'g')
    content = content.replace(openTagRegex, `$1${newName}$2`)
    // 替换闭标签 </AvatarGroup> 为 </AvatarGroup>
    const closeTagRegex = new RegExp(`(<\\/?)${tag}\\.${sub}(>)`, 'g')
    content = content.replace(closeTagRegex, `$1${newName}$2`)
  }
  return content
}

// 替换函数调用，类似 useNumberKeyboardController() => useNumberKeyboardController()
function replaceFunctionCalls(content, map) {
  for (const [oldName, newName] of map) {
    if (!oldName.includes('.')) continue // 组件标签替换不处理这里
    // 匹配函数调用： useNumberKeyboardController(...) 或 useNumberKeyboardController()
    // 注意避免替换 import { useNumberKeyboardController } from ...
    // 用负向前瞻保证函数调用前面不是import导入
    const escapedOld = oldName.replace('.', '\\.')
    const fnCallRegex = new RegExp(`([^\\w])${escapedOld}\\s*\\(`, 'g')
    content = content.replace(fnCallRegex, (m, p1) => `${p1}${newName}(`)
  }
  return content
}

// 在导入块后追加新的导入符号，保持原有格式
// block: {specifiers: [], isMultiline: bool, originalText: string, quote: string, source: string}
// newImports: ['NewComp', 'useNewFn']
// 返回新的导入文本字符串
function addImportsToBlock(block, newImports) {
  const allImports = [...block.specifiers]
  for (const imp of newImports) {
    if (!allImports.includes(imp)) {
      allImports.push(imp)
    }
  }
  // 保持顺序尽量，先原有再新增
  // 生成导入字符串，不加分号末尾
  if (block.isMultiline) {
    return `import {\n  ${allImports.join(',\n  ')}\n} from ${block.quote}${block.source}${block.quote}`
  } else {
    return `import { ${allImports.join(', ')} } from ${block.quote}${block.source}${block.quote}`
  }
}

file.fileList('src', '.jsx,.tsx,.js,.ts', filePath => {
  let content = file.readFile(filePath)

  const originalContent = content

  // 先分析所有import块
  const importBlocks = parseImportBlocks(content)

  // 记录哪些新导入符号需要追加到哪个import块（用模块名作key）
  const importsToAddMap = {}

  // 替换jsx组件标签
  content = replaceJsxTags(content, map)

  // 替换函数调用
  content = replaceFunctionCalls(content, map)

  // 根据替换，检查哪些新符号需要导入
  // 找替换出现在内容里的新符号对应的旧模块名，新增导入
  // 例如替换 Avatar.Group => AvatarGroup，需要在导入Avatar的块后加 AvatarGroup
  // 例如替换 NumberKeyboard.useController => useNumberKeyboardController，需要在NumberKeyboard块后加 useNumberKeyboardController

  for (const [oldName, newName] of map) {
    // 跳过没有替换的新名
    if (!content.includes(newName)) continue

    // 如果旧名是组件标签形式 Avatar.Group，拆分模块名
    if (oldName.includes('.')) {
      const moduleName = oldName.split('.')[0]

      // 旧模块名必须已经导入了，才加新导入
      const blockIndex = findImportBlockIndexByModule(importBlocks, moduleName)
      if (blockIndex === -1) continue

      // 如果新名是旧模块名的一部分，则不需要额外导入，如 InputSearch 替换 Input.Search，而 InputSearch 已经导入了
      // 但实际要检查新名是否已导入
      if (importBlocks[blockIndex].specifiers.includes(newName)) continue

      // 只有当代码中存在新名且内容里有旧模块名的导入，才需要追加
      // 但排除旧模块名本身已包含新名时跳过，防止重复添加

      // 检查旧名是否被替换了，如果替换了，则追加
      // 这里先检查content里是否有新名，且是否有旧模块名导入块包含新名，如果没有则追加
      // 在后面统一追加到importsToAddMap
      if (!importsToAddMap[moduleName]) {
        importsToAddMap[moduleName] = new Set()
      }
      importsToAddMap[moduleName].add(newName)
    }
  }

  // 如果没有新增导入，直接写文件并结束
  if (Object.keys(importsToAddMap).length === 0 && content === originalContent) {
    return
  }

  // 按模块更新导入块文本
  for (const [moduleName, newImportsSet] of Object.entries(importsToAddMap)) {
    const blockIndex = findImportBlockIndexByModule(importBlocks, moduleName)
    if (blockIndex === -1) continue
    const block = importBlocks[blockIndex]
    // 新导入项排除已有的
    const newImports = [...newImportsSet].filter(i => !block.specifiers.includes(i))
    if (newImports.length === 0) continue

    // 更新import文本
    const newImportText = addImportsToBlock(block, newImports)

    // 替换内容
    content = content.slice(0, block.start) + newImportText + content.slice(block.end)

    // 更新 importBlocks 后续索引，防止下次替换错乱
    const diff = newImportText.length - (block.end - block.start)
    for (let i = blockIndex + 1; i < importBlocks.length; i++) {
      importBlocks[i].start += diff
      importBlocks[i].end += diff
    }
    importBlocks[blockIndex].end = importBlocks[blockIndex].start + newImportText.length
    importBlocks[blockIndex].text = newImportText
    importBlocks[blockIndex].specifiers = [...block.specifiers, ...newImports]
  }

  if (content !== originalContent) {
    file.writeFile(filePath, content)
    console.log(`Updated ${filePath}`)
  }
})
