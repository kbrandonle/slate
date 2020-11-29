import { Editor } from 'slate'

export function handleBeforeInputEvent(props: any) {
  const event: React.FormEvent<HTMLDivElement> = props.event
  const editor = props.editor

  // COMPAT: Certain browsers don't support the `beforeinput` event, so we
  // fall back to React's leaky polyfill instead just for it. It
  // only works for the `insertText` input type.
  if (
    !props.HAS_BEFORE_INPUT_SUPPORT &&
    !props.readOnly &&
    !props.isEventHandled(event, props.attributes.onBeforeInput) &&
    props.hasEditableTarget(editor, event.target)
  ) {
    event.preventDefault()
    const text = (event as any).data as string
    Editor.insertText(editor, text)
  }
}
