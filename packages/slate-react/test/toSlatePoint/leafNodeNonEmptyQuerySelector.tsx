/** @jsx jsx */
import { fixtures } from '../../../../support/fixtures'
import { ReactEditor } from '../../src/plugin/react-editor'
import { DOMPoint, DOMElement } from '../../src/utils/dom'
import { SlateRange, SlateNode } from 'slate'
import { mock } from 'jest-mock-extended'
import * as domDependency from '../../src/utils/dom'
import { testToSlatePoint } from '../test'

// Create our mocks
const mockNearestNode = mock<Node>()
// const mockParentNode = mock<DOMElement>()

const voidNode = mock<Element | null>()
const leafNode = mock<Element | null>()
const textNode = mock<Element | null>()
const mockRange = mock<Range>() // mock range return for `window.document.createRange()`

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
      return leafNode
    case '[contenteditable=false]':
      return leafNode
    case '[data-slate-leaf]':
      return leafNode
  }
})

// Mock the hasAttribute funciton with a simple return
const mockHasAttribute = jest.fn().mockReturnValue(true)

// create a mock of the document fragmnt contents
const mockDocumentFragment = {
  querySelectorAll: mockquerySelectorAllFn
}

const mockCloneContents = jest.fn().mockReturnValue(mockDocumentFragment)

const mockCreateRange = jest.fn().mockReturnValue(mockRange)

// Create a mock of the parent node that has interactive functions on it
export const mockParentNode = {
  closest: mockClosestFn,
  removeChild: jest.fn(),
  hasAttribute: mockHasAttribute
}

// mocking workaround for nearest node non-static property
Object.defineProperty(mockNearestNode, 'parentNode', { get() { return mockParentNode } })

export const domPoint = mock<DOMPoint>()
// [
//   mock<Node>(), // Placeholder for node
//   0 // placeholder for offset
// ]

export const mockNearestDOMPoint = [
  mockNearestNode, // Mock object that we attached all our functions to
  0
]

export const output = [
  mock<Node>(), // Placeholder for node
  0 // placeholder for offset
]

// The number of times to expect that the query selector has removed
export const calledTimes = 2

// export the test scoped to this file, so our mocks don't affect the other tests
export const test = (
  mockNearestDOMPoint: [Node, Number],
  domPoint: DOMPoint
) => {
  // Create mock editor
  const mockEditor = mock<ReactEditor>()

  // Mock toslateNode to at least return something
  const mockToSlateNode = jest
    .fn()
    .mockImplementation(() => mock<SlateNode>())

  // basically we want this to mock the textNode that we found ising the rest of the code
  const mockFindPath = jest.fn().mockReturnValue("test")

  // mock normalizeDOMPoint to return the value we recieve
  const mockNormalizeDOMPoint = jest
    .fn()
    .mockReturnValue(mockNearestDOMPoint)

  // Save a refereance to the original functions
  const originalToSlateNode = ReactEditor.toSlateNode
  const originalFindPath = ReactEditor.findPath
  const originalNormalizeDOMPoint = ReactEditor.normalizeDOMPoint

  // replace implementations with mocked functions
  ReactEditor.toSlateNode = mockToSlateNode
  ReactEditor.findPath = mockFindPath
  ReactEditor.normalizeDOMPoint = mockNormalizeDOMPoint
  ReactEditor.window =

  // Evaluate test function
  const returnVal = ReactEditor.toSlatePoint(mockEditor, domPoint)

  // replace implementations with original functions
  ReactEditor.toSlateNode = originalToSlateNode
  ReactEditor.findPath = originalFindPath
  ReactEditor.normalizeDOMPoint = originalNormalizeDOMPoint

  return returnVal
}

