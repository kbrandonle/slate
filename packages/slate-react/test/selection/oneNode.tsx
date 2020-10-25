/** @jsx jsx */
import { Point } from 'slate'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import { stubObject } from 'ts-sinon'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
    <block>three</block>
  </editor>
)

export const test = editor => {
  ReactEditor.toSlatePoint: (editor: Editor, domPoint: DOMPoint) => {
    let point: Point;
    if (domPoint[0].nodeValue == 'one') {
      point.offset = domPoint[1],
        point.path = [0]
    } else if (domPoint[0].nodeValue == 'two') {
      point.offset = domPoint[1],
        point.path = [1]
    } else if (domPoint[0].nodeValue == 'three') {
      point.offset = domPoint[1],
        point.path = [2]
    } else {
      point.offset = -1,
        point.path = [-1]
    }
    return point
  }
  return ReactEditor.toSlateRange(editor, {
    anchorNode: {}

  })
}

export const output = {
  anchor: { path: [0, 0], offset: 1 },
  focus: { path: [1, 0], offset: 2 }
}