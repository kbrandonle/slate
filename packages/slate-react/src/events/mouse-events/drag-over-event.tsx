import { ReactEditor } from 'slate-react/src/plugin/react-editor'
import {
    Editor,
} from 'slate'

export function handleDragOverEvent(props : any) {

    const event : React.DragEvent<HTMLDivElement> = props.event
    const editor = props.editor

    if (
        props.hasTarget(editor, event.target) &&
        !props.isEventHandled(event, props.attributes.onDragOver)
      ) {
        // Only when the target is void, call `preventDefault` to signal
        // that drops are allowed. Editable content is droppable by
        // default, and calling `preventDefault` hides the cursor.
        const node = ReactEditor.toSlateNode(editor, props.event.target)

        if (Editor.isVoid(editor, node)) {
          event.preventDefault()
        }
      }
}