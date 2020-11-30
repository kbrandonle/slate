import React from 'react'
import { fixtures } from '../../../support/fixtures'
import { ReactEditor } from 'slate-react/src/plugin/react-editor'
import {
  DOMSelection,
  DOMNode,
  DOMPoint,
  SlateRangeDescription,
} from 'slate-react/src/utils/dom'
import { SlateRange, SlateNode } from 'slate'
import { mock } from 'jest-mock-extended'
import ReactDOM from 'react-dom'
import EditorExample, {
  getSelectionEditor,
} from 'slate-react/test/editor/sample-editor'
import { act } from 'react-dom/test-utils'
import { ELEMENT_TO_NODE } from 'slate-react/src/utils/weak-maps'
import Hotkeys from '../src/utils/hotkeys'

describe('slate-react', () => {
  fixtures(__dirname, 'selection', ({ module }) => {
    // Arrange
    const {
      selection,
      slateRangeSelection,
      nextNodeEntry,
      output,
      test,
    } = module

    // Act
    const result = test(selection, slateRangeSelection, nextNodeEntry)

    // Assert
    expect(result).toEqual(output)
  })
  fixtures(__dirname, 'toSlatePoint', ({ module }) => {
    // Arrange
    const {
      mockNearestDOMPoint,
      domPoint,
      output,
      exception,
      mockPath,
      calledTimes,
      mockRemoveChild,
      mockGetWindow,
      test,
    } = module

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
      const result = test(
        mockNearestDOMPoint,
        domPoint,
        mockGetWindow,
        mockPath
      )

      // Assert
      expect(result).toEqual(output)
      expect(mockRemoveChild).toBeCalledTimes(calledTimes)
    }
  })
  fixtures(__dirname, 'click-event', ({ module }) => {
    const { selector, output, input } = module

    const tree = document.createElement('div')
    document.body.appendChild(tree)

    act(() => {
      ReactDOM.render(<EditorExample initValue={input} />, tree)
    })

    // selection should be null at init
    expect(getSelectionEditor().selection).toEqual(null)

    // get the element by matching its element tag
    const element = tree.querySelector(selector)

    act(() => {
      // simulate a click
      element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(getSelectionEditor().selection).toEqual(output) // selection should equal output selection
  })
  // for each type of key event for the editor, run a key press
  // simulation to match the correct hotkeys with their corresponding event
  fixtures(__dirname, 'key-event', ({ module }) => {
    const { event, output } = module

    functionArray.map((hotkeyFunction, index) => {
      act(() => {
        expect(hotkeyFunction(event)).toEqual(output[index])
      })
    })
  })
  // does the same thing as the key events above but for mac keys instead
  fixtures(__dirname, 'mac-key-event', ({ module }) => {
    const { event, output } = module

    functionArray.map((hotkeyFunction, index) => {
      act(() => {
        expect(hotkeyFunction(event)).toEqual(output[index])
      })
    })
  })
})

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
  const originalDomRangeToSlateRangeDescription =
    ReactEditor.domRangeToSlateRangeDescription
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

export const testToSlatePoint = (
  mockNearestDOMPoint: [Node, Number],
  domPoint: DOMPoint,
  mockGetWindow: any, // ghetto mock of the window object
  mockPath: Number[]
) => {
  // Create mock editor
  const mockEditor = mock<ReactEditor>()

  // Mock toslateNode to at least return something
  const mockToSlateNode = jest.fn().mockImplementation(() => mock<SlateNode>())

  // basically we want this to mock the textNode that we found using the rest of the code
  const mockFindPath = jest.fn().mockReturnValue(mockPath)

  // mock normalizeDOMPoint to return the value we recieve
  const mockNormalizeDOMPoint = jest.fn().mockReturnValue(mockNearestDOMPoint)

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

const functionArray = [
  e => Hotkeys.isBold(e),
  e => Hotkeys.isItalic(e),
  e => Hotkeys.isCompose(e),
  e => Hotkeys.isMoveBackward(e),
  e => Hotkeys.isMoveForward(e),
  e => Hotkeys.isDeleteBackward(e),
  e => Hotkeys.isDeleteForward(e),
  e => Hotkeys.isDeleteLineBackward(e),
  e => Hotkeys.isDeleteLineForward(e),
  e => Hotkeys.isDeleteWordBackward(e),
  e => Hotkeys.isExtendBackward(e),
  e => Hotkeys.isDeleteWordForward(e),
  e => Hotkeys.isExtendForward(e),
  e => Hotkeys.isExtendLineBackward(e),
  e => Hotkeys.isExtendLineForward(e),
  e => Hotkeys.isMoveLineBackward(e),
  e => Hotkeys.isMoveLineForward(e),
  e => Hotkeys.isMoveWordBackward(e),
  e => Hotkeys.isMoveWordForward(e),
  e => Hotkeys.isRedo(e),
  e => Hotkeys.isSplitBlock(e),
  e => Hotkeys.isTransposeCharacter(e),
  e => Hotkeys.isUndo(e),
]

// https://keycode.info/   -- info for each string key
