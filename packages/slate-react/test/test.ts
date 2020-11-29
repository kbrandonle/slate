import { fixtures } from '../../../support/fixtures'
import { ReactEditor } from '../src/plugin/react-editor'
import { DOMSelection, DOMPoint } from '../src/utils/dom'
import { SlateRange, SlateNode } from 'slate'
import { mock } from 'jest-mock-extended'

describe('slate-react', () => {
  fixtures(__dirname, 'selection', ({ module }) => {
    // Arrange
    const { selection, slateRangeSelection, nextNodeEntry, output, test } = module

    // Act
    const result = test(
      selection,
      slateRangeSelection,
      nextNodeEntry
    )

    // Assert
    expect(result).toEqual(output)
  })
  fixtures(__dirname, 'toSlatePoint', ({ module }) => {
    // Arrange
    const { mockNearestDOMPoint, domPoint, output, exception, mockPath, calledTimes, mockRemoveChild, mockGetWindow, test } = module

    // Different test case for exceptions
    if (exception) {
      // Assert
      expect(
        // Act in an arrow method so the expect can catch the exception
        () => {
          test(mockNearestDOMPoint, domPoint, mockGetWindow, mockPath)
        }
      ).toThrow(exception)
    } else {
      // Act
      const result = test(mockNearestDOMPoint, domPoint, mockGetWindow, mockPath)

      // Assert
      expect(result).toEqual(output)
      expect(mockRemoveChild).toBeCalledTimes(calledTimes)
    }
  })
})

export const testToSlatePoint = (
  mockNearestDOMPoint: [Node, Number],
  domPoint: DOMPoint,
  mockGetWindow: any, // ghetto mock of the window object
  mockPath: Number[]
) => {
  // Create mock editor
  const mockEditor = mock<ReactEditor>()

  // Mock toslateNode to at least return something
  const mockToSlateNode = jest
    .fn()
    .mockImplementation(() => mock<SlateNode>())

  // basically we want this to mock the textNode that we found using the rest of the code
  const mockFindPath = jest.fn().mockReturnValue(mockPath)

  // mock normalizeDOMPoint to return the value we recieve
  const mockNormalizeDOMPoint = jest
    .fn()
    .mockReturnValue(mockNearestDOMPoint)

  // Save a refereance to the original functions
  const originalToSlateNode = ReactEditor.toSlateNode
  const originalFindPath = ReactEditor.findPath
  const originalNormalizeDOMPoint = ReactEditor.normalizeDOMPoint
  const originalGetWindow = ReactEditor.getWindow

  // replace implementations with mocked functions
  ReactEditor.toSlateNode = mockToSlateNode
  ReactEditor.findPath = mockFindPath
  ReactEditor.normalizeDOMPoint = mockNormalizeDOMPoint
  ReactEditor.getWindow = mockGetWindow

  // Evaluate test function
  const returnVal = ReactEditor.toSlatePoint(mockEditor, domPoint)

  // replace implementations with original functions
  ReactEditor.toSlateNode = originalToSlateNode
  ReactEditor.findPath = originalFindPath
  ReactEditor.normalizeDOMPoint = originalNormalizeDOMPoint
  ReactEditor.getWindow = originalGetWindow

  return returnVal
}

export const testToSlateRange = (
  inputSelection: DOMSelection,
  inputSlateRangeSelection: SlateRange,
  nextNodeEntry: number[] | undefined
) => {
  // Create our mocks for the functions toSlateRange is dependent on
  // extract the expected slate range selection from our passed object
  const mockToSlatePoint = jest
    .fn()
    .mockReturnValueOnce(inputSlateRangeSelection.anchor)
    .mockReturnValueOnce(inputSlateRangeSelection.focus)

  // always return input selection in its current form
  const mockDomRangeToSlateRangeDescription = jest
    .fn()
    .mockReturnValue(inputSelection) // Our input will already be in the form we are expecting

  // return next `NodeEntry` if the test specifies that the next node is the focus node.
  const mockNextNode = jest.fn().mockReturnValue(nextNodeEntry)

  const mockEditor = mock<ReactEditor>()

  // Save a refereance to the original functions
  const originalToSlatePoint = ReactEditor.toSlatePoint
  const originalDomRangeToSlateRangeDescription = ReactEditor.domRangeToSlateRangeDescription
  const originalNext = ReactEditor.next

  // replace dependancies with mocked implementations
  ReactEditor.toSlatePoint = mockToSlatePoint
  ReactEditor.domRangeToSlateRangeDescription = mockDomRangeToSlateRangeDescription
  ReactEditor.next = mockNextNode

  // evaluate function
  const returnVal = ReactEditor.toSlateRange(mockEditor, inputSelection)

  // Replace dependencies with their original function references
  ReactEditor.toSlatePoint = originalToSlatePoint
  ReactEditor.domRangeToSlateRangeDescription = originalDomRangeToSlateRangeDescription
  ReactEditor.next = originalNext

  return returnVal
}
