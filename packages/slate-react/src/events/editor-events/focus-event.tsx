import { ReactEditor } from 'slate-react/src/plugin/react-editor'

export function handleOnFocusEvent(props: any) {
  const event: React.FocusEvent<HTMLDivElement> = props.event
  const editor = props.editor

  if (
    !props.readOnly &&
    !props.state.isUpdatingSelection &&
    props.hasEditableTarget(editor, event.target) &&
    !props.isEventHandled(event, props.attributes.onFocus)
  ) {
    const el = ReactEditor.toDOMNode(editor, editor)
    props.state.latestElement = window.document.activeElement

    // COMPAT: If the editor has nested editable elements, the focus
    // can go to them. In Firefox, this must be prevented because it
    // results in issues with keyboard navigation. (2017/03/30)
    if (props.IS_FIREFOX && event.target !== el) {
      el.focus()
      return
    }

    props.IS_FOCUSED.set(editor, true)
  }
}
