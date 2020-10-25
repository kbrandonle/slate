/** @jsx jsx */
import { ReactEditor } from 'slate-react'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
    <block>three</block>
  </editor>
)

export const test = editor => {
  return ReactEditor.toSlateRange(editor, {
    anchor: { path: [0, 0], offset: 1 },
    focus: { path: [1, 0], offset: 2 },
  })
}

export const output = { path: [1, 0], offset: 3 }