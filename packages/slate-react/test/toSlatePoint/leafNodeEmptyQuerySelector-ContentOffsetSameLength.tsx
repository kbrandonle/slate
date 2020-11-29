/** @jsx jsx */
import { DOMPoint } from '../../src/utils/dom'
import { mock } from 'jest-mock-extended'
import { testToSlatePoint } from '../test'

const textContent = "testString" // length of 10

// Create our mocks
const mockNearestNode = mock<Node>()

const voidNode = mock<Element | null>()
const textNode = mock<Element | null>()

// When we return a leaf node, it will contain a function for looking up a deeper nested leafNode
const mockLeafNode = {
  closest: jest.fn((input: string) => {
    return mockLeafNode
  }),
  textContent: textContent // each leaf node has mock text content
}

// mock function to count the number of times remove child is called.
export const mockRemoveChild = jest.fn()

const queryElement = {
  parentNode: {
    removeChild: mockRemoveChild
  }
}

// Simply return the nodes we want it to return
const mockClosestFn = jest.fn((input: string) => {
  switch (input) {
    case '[data-slate-void="true"]':
      return voidNode
    case '[data-slate-leaf]':
      return mockLeafNode
    case '[data-slate-node="text"]':
      return textNode
  }
})

// Simply return empty array since we are simulating an empty list
const mockquerySelectorAllFn = jest.fn().mockReturnValue([])

// Mock the hasAttribute function with a simple return
const mockHasAttribute = jest.fn().mockReturnValue(true)

// Create a mock of the parent node that has interactive functions on it
const mockParentNode = {
  closest: mockClosestFn,
  removeChild: mockRemoveChild,
  hasAttribute: mockHasAttribute
}

// create a mock of the document fragmnt contents
const mockDocumentFragment = {
  querySelectorAll: mockquerySelectorAllFn,
  textContent: textContent
}

// mock range return for `window.document.createRange()`
const mockRange = {
  cloneContents: jest
    .fn()
    .mockReturnValue(mockDocumentFragment),
  setStart: () => { }, // noop
  setEnd: () => { } // noop
}

// we need to mock the window to use the createRange, so we will export our own window object
const mockCreateRange = jest.fn().mockReturnValue(mockRange)
const mockWindow = {
  document: {
    createRange: mockCreateRange
  }
}
export function mockGetWindow() { return mockWindow }

// mocking workaround for nearest node non-static property
Object.defineProperty(mockNearestNode, 'parentNode', { get() { return mockParentNode } })

// starting DOMPoint that we are testing from
export const domPoint = mock<DOMPoint>()

export const mockNearestDOMPoint = [
  mockNearestNode, // Mock object that we attached all our functions to
  0 // placeholder for offset
]

// Mock path of our mock node
export const mockPath = [0, 0]

// The output we are expecting at the end of execution
export const output = {
  offset: textContent.length - 1, //subtract 1 since we are the same length as the domnode
  path: [0, 0] // mock path
}

// The number of times to expect that the query selector has removed
export const calledTimes = 0

// export the test scoped to this file, so our mocks don't affect the other tests
export const test = testToSlatePoint

