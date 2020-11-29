import { ReactEditor } from 'slate-react/src/plugin/react-editor'
import { Editor, SlateRange } from 'slate'

export function handleCutEvent(props: any) {
  const editor: ReactEditor = props.editor
  const event: React.ClipboardEvent<HTMLDivElement> = props.event

  if (
    !props.readOnly &&
    props.hasEditableTarget(editor, event.target) &&
    !props.isEventHandled(event, props.attributes.onCut)
  ) {
    event.preventDefault()
    ReactEditor.setFragmentData(editor, event.clipboardData)
    const { selection } = editor

    if (selection && SlateRange.isExpanded(selection)) {
      Editor.deleteFragment(editor)
    }
  }
}
