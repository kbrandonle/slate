import { fixtures } from '../../../support/fixtures'
import { ReactEditor } from '../src/plugin/react-editor'
import { DOMSelection, DOMElement, DOMPoint } from '../src/utils/dom'
import { SlateRange, SlateNode } from 'slate'
import { mock } from 'jest-mock-extended'
import * as domDependency from '../src/utils/dom'
import { exception } from 'console'

describe('slate-react', () => {
  // fixtures(__dirname, 'selection', ({ module }) => {
  //   // Arrange
  //   const { selection, slateRangeSelection, nextNodeEntry, output } = module

  //   // Act
  //   const result = testToSlateRange(
  //     selection,
  //     slateRangeSelection,
  //     nextNodeEntry
  //   )

  //   // Assert
  //   expect(result).toEqual(output)
  // })
  fixtures(__dirname, 'toSlatePoint', ({ module }) => {
    // Arrange
    const { mockNearestDOMPoint, domPoint, output, exception } = module

    // Different test case for exceptions
    if (exception) {
      // Assert
      expect(
        // Act in an arrow method so the expect can catch the exception
        () => {
          console.log(testToSlatePoint(mockNearestDOMPoint, domPoint))
        }
      ).toThrow(exception)
    } else {
      // Act
      const result = testToSlatePoint(mockNearestDOMPoint, domPoint)

      // Assert
      expect(result).toEqual(output)
    }
  })
})

const testToSlatePoint = (
  mockNearestDOMPoint: [Node, Number], 
  domPoint: DOMPoint
) => {
  // Create mock editor
  const mockEditor = mock<ReactEditor>()

  // Mock dependencies
  jest.mock('../src/utils/dom', () => ({
    normalizeDOMPoint: jest
      .fn()
      .mockReturnValue(mockNearestDOMPoint)
  }))

  ReactEditor.toSlateNode = jest
    .fn()
    .mockReturnValue(mock<SlateNode>())

  // basically we want this to mock the textNode that we found ising the rest of the code
  ReactEditor.findPath = jest.fn().mockReturnValue("test")

  return ReactEditor.toSlatePoint(mockEditor, domPoint)
}

const testToSlateRange = (
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

  // replace dependancies with mocked implementations
  ReactEditor.toSlatePoint = mockToSlatePoint
  ReactEditor.domRangeToSlateRangeDescription = mockDomRangeToSlateRangeDescription
  ReactEditor.next = mockNextNode

  return ReactEditor.toSlateRange(mockEditor, inputSelection)
}
