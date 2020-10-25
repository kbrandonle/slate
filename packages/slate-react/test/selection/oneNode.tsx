/** @jsx jsx */
import { Point } from 'slate'
import { ReactEditor } from '../../src/plugin/react-editor'
import { stubInterface, stubConstructor } from 'ts-sinon'

let mockNode = stubInterface<Point>()
let mockReactEditor = stubInterface<ReactEditor>()


export const input = {
  
}

export const test = editor => {
  mockReactEditor.toSlatePoint.
}

export const output = {
  anchor: { path: [0, 0], offset: 1 },
  focus: { path: [1, 0], offset: 2 }
}