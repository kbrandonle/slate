import { Editor } from 'slate'

export function handleCompositionEndEvent(props: any) {
  const event: React.CompositionEvent<HTMLDivElement> = props.event
  const editor = props.editor

  if (
    props.hasEditableTarget(editor, event.target) &&
    !props.isEventHandled(event, props.attributes.onCompositionEnd)
  ) {
    props.state.isComposing = false

    // COMPAT: In Chrome, `beforeinput` events for compositions
    // aren't correct and never fire the "insertFromComposition"
    // type that we need. So instead, insert whenever a composition
    // ends since it will already have been committed to the DOM.
    if (!props.IS_SAFARI && !props.IS_FIREFOX && event.data) {
      Editor.insertText(editor, event.data)
    }
  }
}
