import { ReactEditor } from 'slate-react/src/plugin/react-editor'

export function handleCopyEvent(props : any) {
    const editor : ReactEditor = props.editor
    const event : React.ClipboardEvent<HTMLDivElement> = props.event

    if (
        props.hasEditableTarget(editor, event.target) &&
        !props.isEventHandled(event, props.attributes.onCopy)
      ) {
        event.preventDefault()
        ReactEditor.setFragmentData(editor, event.clipboardData)
      }
}