import { ReactEditor } from 'slate-react/src/plugin/react-editor'

/*
  Handle click event by selecting it if it is a void node
*/
export function handleClickEvent(props: any) {
  const reactEditor: ReactEditor = props.editor
  const clickEvent: React.MouseEvent<HTMLDivElement> = props.event

  if (
    !props.readOnly &&
    props.hasTarget(reactEditor, clickEvent.target) &&
    !props.isEventHandled(clickEvent, props.attributes.onClick) &&
    props.isDOMNode(clickEvent.target)
  ) {
    const node = props.ReactEditor.toSlateNode(reactEditor, clickEvent.target)
    const path = props.ReactEditor.findPath(reactEditor, node)
    const start = props.Editor.start(reactEditor, path)
    const end = props.Editor.end(reactEditor, path)

    const startVoid = props.Editor.void(reactEditor, { at: start })
    const endVoid = props.Editor.void(reactEditor, { at: end })

    if (startVoid && endVoid && props.Path.equals(startVoid[1], endVoid[1])) {
      const range = props.Editor.range(reactEditor, start)
      props.Transforms.select(reactEditor, range)
    }
  }
}
