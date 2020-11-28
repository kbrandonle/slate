import React from 'react'
import { fixtures } from '../../../support/fixtures'
import { ReactEditor } from 'slate-react/src/plugin/react-editor'
import { DOMSelection, DOMNode, SlateRangeDescription } from 'slate-react/src/utils/dom'
import { SlateRange } from 'slate'
import { mock } from 'jest-mock-extended'
import ReactDOM from "react-dom";
import EditorExample, { getSelectionEditor } from 'slate-react/test/editor/sample-editor'
import { act } from 'react-dom/test-utils';
import { ELEMENT_TO_NODE } from 'slate-react/src/utils/weak-maps'

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
})

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

describe('slate-react', () => {
  fixtures(__dirname, 'click-event', ({ module }) => {
    const {selector, output, input} = module

    var tree = document.createElement('div')
    document.body.appendChild(tree)

    act(() => {
      ReactDOM.render(<EditorExample initValue={input}/>, tree)
    })

    // selection should be null at init
    expect(getSelectionEditor().selection).toEqual(null)

    // get the element by matching its element tag
    const element = tree.querySelector(selector)

    act(() => {
      // simulate a click
      element.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    })

    expect(getSelectionEditor().selection).toEqual(output) // selection should equal output selection
  })
})

describe('slate-react', () => {
  fixtures(__dirname, 'key-event', ({ module }) => {
    const {selector, output, input} = module

    var tree = document.createElement('div')
    document.body.appendChild(tree)

    act(() => {
      ReactDOM.render(<EditorExample initValue={input}/>, tree)
    })

    //console.log(getSelectionEditor().children[0])

    const element = tree.querySelector("p");

    act(() => {
      // simulate type event
      element.dispatchEvent(new KeyboardEvent('keypress', {ctrlKey : false ,bubbles: true, key : 'c'}));
      //element.innerHTML += "dfgdfgdfgdf"
      //console.log("ELEMENT TEXT: " + element.textContent)
    })

    //console.log(getSelectionEditor().children[0].children)
  })
})
