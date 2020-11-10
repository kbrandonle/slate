import { fixtures } from '../../../support/fixtures'
import { ReactEditor } from '../src/plugin/react-editor'
import { DOMSelection } from '../src/utils/dom'
import { SlateRange } from 'slate'
import { mock } from 'jest-mock-extended'

describe('slate-react', () => {
  fixtures(__dirname, 'selection', ({ module }) => {
    // Arrange
    const { selection, slateRangeSelection, nextNodeEntry, output } = module

    // Act
    const result = testToSlateRange(
      selection,
      slateRangeSelection,
      nextNodeEntry
    )

    // Assert
    expect(result).toEqual(output)
  })
  fixtures(__dirname, 'point', ({module}) => {
    // Arrange
    const { selection, slateRangeSelection, nextNodeEntry, output } = module

    // Act
    const result = testToSlateRange(
      selection,
      slateRangeSelection,
      nextNodeEntry
    )

    // Assert
    expect(result).toEqual(output)
  })
})

const testToSlatePoint = () => {
  // https://stackoverflow.com/questions/40465047/how-can-i-mock-an-es6-module-import-using-jest
  const mockEditor = mock<ReactEditor>()

  ReactEditor.toSlateNode = jest.fn()
  ReactEditor.findPath = jest.fn()
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
