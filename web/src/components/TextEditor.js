import React, { /*useEffect*/ useState } from 'react'
import RichTextEditor from 'react-rte'
import './TextEditor.less'

const toolbarConfig = {
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    { label: 'Negrito', style: 'BOLD' },
    { label: 'Itálico', style: 'ITALIC' },
    { label: 'Sublinhado', style: 'UNDERLINE' }
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: 'Lista simples', style: 'unordered-list-item'},
    { label: 'Lista numerada', style: 'ordered-list-item'},
    { label: 'Citação', style: 'blockquote'},
  ]
}

const TextEditor = props => {
  const { onChange, value } = props
  const [innerValue, setInnerValue] = useState(value
    ? RichTextEditor.createValueFromString(value, 'html')
    : RichTextEditor.createEmptyValue()
  )

  const onChangeValue = newValue => {
    setInnerValue(newValue)
    onChange && onChange(newValue.toString('html'))
  }

  return (
    <div className='text-editor-custom'>
      <RichTextEditor
        onChange={onChangeValue}
        toolbarConfig={toolbarConfig}
        value={innerValue}
      />
    </div>
  )
}

export default TextEditor