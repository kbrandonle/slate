import { ReactEditor } from 'slate-react/src/plugin/react-editor'
import {
    Element,
  } from 'slate'

export function handleOnBlurEvent(props : any) {

    const editor: ReactEditor = props.editor
    const event = props.event
    const state = props.state

    if (
        props.readOnly ||
        state.isUpdatingSelection ||
        !props.hasEditableTarget(editor, event.target) ||
        props.isEventHandled(event, props.attributes.onBlur)
      ) {
        return
      }

      // COMPAT: If the current `activeElement` is still the previous
      // one, this is due to the window being blurred when the tab
      // itself becomes unfocused, so we want to abort early to allow to
      // editor to stay focused when the tab becomes focused again.
      if (state.latestElement === window.document.activeElement) {
        return
      }

      const { relatedTarget } = event
      const el = ReactEditor.toDOMNode(editor, editor)

      // COMPAT: The event should be ignored if the focus is returning
      // to the editor from an embedded editable element (eg. an <input>
      // element inside a void node).
      if (relatedTarget === el) {
        return
      }

      // COMPAT: The event should be ignored if the focus is moving from
      // the editor to inside a void node's spacer element.
      if (
        props.isDOMElement(relatedTarget) &&
        relatedTarget.hasAttribute('data-slate-spacer')
      ) {
        return
      }

      // COMPAT: The event should be ignored if the focus is moving to a
      // non- editable section of an element that isn't a void node (eg.
      // a list item of the check list example).
      if (
        relatedTarget != null &&
        props.isDOMNode(relatedTarget) &&
        ReactEditor.hasDOMNode(editor, relatedTarget)
      ) {
        const node = ReactEditor.toSlateNode(editor, relatedTarget)

        if (Element.isElement(node) && !editor.isVoid(node)) {
          return
        }
      }

      props.IS_FOCUSED.delete(editor)
}