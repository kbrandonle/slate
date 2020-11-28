
export function handleCompositionStartEvent(props : any) {
    
    const event : React.CompositionEvent<HTMLDivElement> = props.event
    const editor = props.editor
    
    if (
        props.hasEditableTarget(editor, event.target) &&
        !props.isEventHandled(event, props.attributes.onCompositionStart)
      ) {
        props.state.isComposing = true
      }
}