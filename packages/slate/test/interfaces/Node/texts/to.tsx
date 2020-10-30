/** @jsx jsx  */
import { SlateNode } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text key="a" />
      <text key="b" />
      <text key="c" />
      <text key="d" />
    </element>
  </editor>
)
export const test = value => {
  return Array.from(
    SlateNode.texts(value, {
      from: [0, 1],
      to: [0, 2],
    })
  )
}
export const output = [
  [<text key="b" />, [0, 1]],
  [<text key="c" />, [0, 2]],
]
