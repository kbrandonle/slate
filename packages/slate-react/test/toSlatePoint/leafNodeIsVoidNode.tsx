/** @jsx jsx */
import { DOMPoint } from '../../src/utils/dom'
import { mock } from 'jest-mock-extended'
import { testToSlatePoint } from '../test'

const textContent = 'testString' // length of 10

// Create our mocks
const mockNearestNode = mock<Node>()

const voidNode = mock<Element | null>()
const textNode = mock<Element | null>()

// When we return a void node, it will contain a function for looking up a deeper nested voidNode
const mockVoidNode = {
  closest: jest.fn(() => {
    return mockVoidNode
  }),
  querySelector: jest.fn(() => {
    return mockVoidNode
  }),
  textContent, // each leaf node has mock text content
}

// mock function to count the number of times remove child is called.
export const mockRemoveChild = jest.fn()

const queryElement = {
  parentNode: {
    removeChild: mockRemoveChild,
  },
}

// Simply return the nodes we want it to return
const mockClosestFn = jest.fn((input: string) => {
  switch (input) {
    case '[data-slate-void="true"]':
      return mockVoidNode
    case '[data-slate-leaf]':
      return null
    case '[data-slate-node="text"]':
      return textNode
  }
})

// Simply return the nodes we want
const mockquerySelectorAllFn = jest.fn((input: string) => {
  switch (input) {
    case '[data-slate-zero-width]':
      return [queryElement]
    case '[contenteditable=false]':
      return [queryElement]
    case '[data-slate-leaf]':
      return [queryElement]
  }
})

// Mock the hasAttribute function with a simple return
const mockHasAttribute = jest.fn().mockReturnValue(true)

// create a mock of the document fragmnt contents
const mockDocumentFragment = {
  querySelectorAll: mockquerySelectorAllFn,
  textContent,
}

// mock range return for `window.document.createRange()`
const mockRange = {
  cloneContents: jest.fn().mockReturnValue(mockDocumentFragment),
  setStart: () => {}, // noop
  setEnd: () => {}, // noop
}

// we need to mock the window to use the createRange, so we will export our own window object
const mockCreateRange = jest.fn().mockReturnValue(mockRange)
const mockWindow = {
  document: {
    createRange: mockCreateRange,
  },
}
export function mockGetWindow() {
  return mockWindow
}

// Create a mock of the parent node that has interactive functions on it
const mockParentNode = {
  closest: mockClosestFn,
  removeChild: mockRemoveChild,
  hasAttribute: mockHasAttribute,
}

// mocking workaround for nearest node non-static property
Object.defineProperty(mockNearestNode, 'parentNode', {
  get() {
    return mockParentNode
  },
})

// starting DOMPoint that we are testing from
export const domPoint = mock<DOMPoint>()

export const mockNearestDOMPoint = [
  mockNearestNode, // Mock object that we attached all our functions to
  0, // placeholder for offset
]

// Mock path of our mock node
export const mockPath = [0, 0]

// The output we are expecting at the end of execution
export const output = {
  offset: textContent.length - 1, // subtract 1 since we start at 0
  path: [0, 0], // mock path
}

// The number of times to expect that the query selector has removed
export const calledTimes = 0

// export the test scoped to this file, so our mocks don't affect the other tests
export const test = testToSlatePoint
