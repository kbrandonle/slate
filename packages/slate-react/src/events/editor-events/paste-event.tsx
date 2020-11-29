import { ReactEditor } from 'slate-react/src/plugin/react-editor'

/*
    note: This function never gets called!
*/
export function handlePasteEvent(props: any) {
  // COMPAT: Certain browsers don't support the `beforeinput` event, so we
  // fall back to React's `onPaste` here instead.
  // COMPAT: Firefox, Chrome and Safari are not emitting `beforeinput` events
  // when "paste without formatting" option is used.
  // This unfortunately needs to be handled with paste events instead.
  const editor: ReactEditor = props.editor
  const event: React.ClipboardEvent<HTMLDivElement> = props.event

  if (
    props.hasEditableTarget(editor, event.target) &&
    !props.isEventHandled(event, props.attributes.onPaste) &&
    (!props.HAS_BEFORE_INPUT_SUPPORT ||
      props.isPlainTextOnlyPaste(event.nativeEvent)) &&
    !props.readOnly
  ) {
    event.preventDefault()
    ReactEditor.insertData(editor, event.clipboardData)
  }
}
