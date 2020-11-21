import React, { useState, useMemo } from 'react'
import { SlateNode, Transforms, createEditor } from 'slate'
import {
  Slate,
  Editable,
  useSelected,
  useFocused,
  useSlateStatic,
  withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'

var selectionEditor = null

const EditorExample = (props) => { // take in a initial value to test. 
    const [value, setValue] = useState<SlateNode[]>(props.initValue) // initial value can be set here
    const editor = useMemo(
      () => withImages(withHistory(withReact(createEditor()))),
      []
    )

    selectionEditor = editor
  
    return (
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <Editable
          renderElement={props => <Element {...props} />}
          placeholder="Enter some text..."
        />
      </Slate>
    )
  }

  export const getSelectionEditor = () => {
    return selectionEditor
  }

  const Element = props => {
    const { attributes, children, element } = props
  
    switch (element.type) {
      case 'image':
        return <ImageElement {...props} />
      case 'editable-void':
        return <EditableVoidElement {...props} />
        case 'video':
      return <VideoElement {...props} />
      case 'mention':
      return <MentionElement {...props} />
      case 'link':
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      )
      case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
      case 'list-item':
      return <li {...attributes}>{children}</li>
      case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
      case 'table':
      return (
        <table>
          <tbody {...attributes}>{children}</tbody>
        </table>
      )
    case 'table-row':
      return <tr {...attributes}>{children}</tr>
    case 'table-cell':
      return <td {...attributes}>{children}</td>
      default:
        return <p {...attributes}>{children}</p>
    }
  }

  const MentionElement = ({ attributes, children, element }) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
      <span
        {...attributes}
        contentEditable={false}
        style={{
          padding: '3px 3px 2px',
          margin: '0 1px',
          verticalAlign: 'baseline',
          display: 'inline-block',
          borderRadius: '4px',
          backgroundColor: '#eee',
          fontSize: '0.9em',
          boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
        }}
      >
        @{element.character}
        {children}
      </span>
    )
  }

  const EditableVoidElement = ({ attributes, children, element }) => {
    const [inputValue, setInputValue] = useState('')
  
    return (
      <div {...attributes} contentEditable={false}>
        <div
          className={`
            box-shadow: 0 0 0 3px #ddd;
            padding: 8px;
          `}
        >
          <h4>Name:</h4>
          <input
            className={`
              margin: 8px 0;
            `}
            type="text"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value)
            }}
          />
        </div>
        {children}
      </div>
    )
  }

const ImageElement = ({ attributes, children, element }) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
      <div {...attributes}>
        <div contentEditable={false}>
          <img
            src={element.url}
            id="myImage"
            className={`
              display: block;
              max-width: 100%;
              max-height: 20em;
              box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}; 
            `}
          />
        </div>
        {children}
      </div>
    )
  }

  const VideoElement = ({ attributes, children, element }) => {
    const editor = useSlateStatic()
    const { url } = element
    return (
      <div {...attributes}>
        <div contentEditable={false}>
          <div
            style={{
              padding: '75% 0 0 0',
              position: 'relative',
            }}
          >
            <iframe
              src={`${url}?title=0&byline=0&portrait=0`}
              frameBorder="0"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>
        {children}
      </div>
    )
  }
  
  const withImages = editor => {
    const { insertData, isVoid } = editor
  
    editor.isVoid = element => {
        if(element.type === 'editable-void')
            return true
        return element.type === 'image' ? true : isVoid(element)
    }
  
    editor.insertData = data => {
      const text = data.getData('text/plain')
      insertImage(editor, text)
    }
  
    return editor
  }

const insertImage = (editor, url) => {
    const text = { text: '' }
    const image = { type: 'image', url, children: [text] }
    Transforms.insertNodes(editor, image)
}

export default EditorExample;