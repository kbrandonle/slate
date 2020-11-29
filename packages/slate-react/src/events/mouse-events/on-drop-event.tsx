import { ReactEditor } from 'slate-react/src/plugin/react-editor'
import { Transforms } from 'slate'

export function handleDropEvent(props: any) {
  const event: React.DragEvent<HTMLDivElement> = props.event
  const editor = props.editor

  if (
    props.hasTarget(editor, event.target) &&
    !props.readOnly &&
    !props.isEventHandled(event, props.attributes.onDrop)
  ) {
    // COMPAT: Certain browsers don't fire `beforeinput` events at all, and
    // Chromium browsers don't properly fire them for files being
    // dropped into a `contenteditable`. (2019/11/26)
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1028668
    if (
      !props.HAS_BEFORE_INPUT_SUPPORT ||
      (!props.IS_SAFARI && event.dataTransfer.files.length > 0)
    ) {
      event.preventDefault()
      const range = ReactEditor.findEventRange(editor, event)
      const data = event.dataTransfer
      Transforms.select(editor, range)
      ReactEditor.insertData(editor, data)
    }
  }
}
