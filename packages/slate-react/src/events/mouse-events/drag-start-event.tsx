import { ReactEditor } from 'slate-react/src/plugin/react-editor'
import { Editor, Transforms } from 'slate'

export function handleDragStartEvent(props: any) {
  const event: React.DragEvent<HTMLDivElement> = props.event
  const editor = props.editor

  if (
    props.hasTarget(editor, event.target) &&
    !props.isEventHandled(event, props.attributes.onDragStart)
  ) {
    const node = ReactEditor.toSlateNode(editor, props.event.target)
    const path = ReactEditor.findPath(editor, node)
    const voidMatch = Editor.void(editor, { at: path })

    // If starting a drag on a void node, make sure it is selected
    // so that it shows up in the selection's fragment.
    if (voidMatch) {
      const range = Editor.range(editor, path)
      Transforms.select(editor, range)
    }

    ReactEditor.setFragmentData(editor, event.dataTransfer)
  }
}
