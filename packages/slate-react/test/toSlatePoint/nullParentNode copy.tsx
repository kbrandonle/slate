/** @jsx jsx */
import { fixtures } from '../../../../support/fixtures'
import { ReactEditor } from '../../src/plugin/react-editor'
import { DOMSelection, DOMElement } from '../../src/utils/dom'
import { SlateRange } from 'slate'
import { mock } from 'jest-mock-extended'
import * as domDependency from '../../src/utils/dom'

// Create our mocks
const mockNearestNode = mock<Node>()
const mockParentNode = mock<DOMElement>()

const voidNode = mock<Element | null>()
const leafNode = mock<Element | null>()
const textNode = mock<Element | null>()
const mockRange = mock<Range>() // mock range return for `window.document.createRange()`

const mockDocumentFragment = mock<DocumentFragment>()

const mockCloneContents = jest
  .fn()
  .mockReturnValue(mockDocumentFragment)

// Simply return the nodes we want it to return
const mockClosestFn = jest.fn((input: string) => {
  switch (input) {
    case '[data-slate-void="true"]':
      return voidNode
    case '[data-slate-leaf]':
      return leafNode
    case '[data-slate-node="text"]':
      return textNode
  }
})

// Simply return the nodes we want
const mockquerySelectorAllFn = jest.fn((input: string) => {
  switch (input) {
    case '[data-slate-zero-width]':
      return voidNode
    case '[contenteditable=false]':
      return leafNode
    case '[data-slate-leaf]':
      return voidNode
  }
})


jest
  .spyOn(mockNearestNode, 'parentNode', 'get')
  .mockReturnValue(mockParentNode)

export const nearestDOMPoint = [
  mockNearestNode, // Mock object that we attached all our functions to
  0
]

export const output = [
  mock<Node>(), // Placeholder for node
  0 // placeholder for offset
]
