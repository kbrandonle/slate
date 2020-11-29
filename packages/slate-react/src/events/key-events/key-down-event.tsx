import { ReactEditor } from 'slate-react/src/plugin/react-editor'
import Hotkeys from 'slate-react/src/utils/hotkeys'
import { Editor, SlateRange, Transforms } from 'slate'

export function handleKeyDownEvent(props: any) {
  const editor: ReactEditor = props.editor
  const event: React.KeyboardEvent<HTMLDivElement> = props.event

  if (
    !props.readOnly &&
    props.hasEditableTarget(editor, event.target) &&
    !props.isEventHandled(event, props.attributes.onKeyDown)
  ) {
    const { nativeEvent } = event
    const { selection } = editor

    // COMPAT: Since we prevent the default behavior on
    // `beforeinput` events, the browser doesn't think there's ever
    // any history stack to undo or redo, so we have to manage these
    // hotkeys ourselves. (2019/11/06)
    if (Hotkeys.isRedo(nativeEvent)) {
      event.preventDefault()

      if (typeof editor.redo === 'function') {
        editor.redo()
      }

      return
    }

    if (Hotkeys.isUndo(nativeEvent)) {
      event.preventDefault()

      if (typeof editor.undo === 'function') {
        editor.undo()
      }

      return
    }

    // COMPAT: Certain browsers don't handle the selection updates
    // properly. In Chrome, the selection isn't properly extended.
    // And in Firefox, the selection isn't properly collapsed.
    // (2017/10/17)
    if (Hotkeys.isMoveLineBackward(nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'line', reverse: true })
      return
    }

    if (Hotkeys.isMoveLineForward(nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'line' })
      return
    }

    if (Hotkeys.isExtendLineBackward(nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, {
        unit: 'line',
        edge: 'focus',
        reverse: true,
      })
      return
    }

    if (Hotkeys.isExtendLineForward(nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'line', edge: 'focus' })
      return
    }

    // COMPAT: If a void node is selected, or a zero-width text node
    // adjacent to an inline is selected, we need to handle these
    // hotkeys manually because browsers won't be able to skip over
    // the void node with the zero-width space not being an empty
    // string.
    if (Hotkeys.isMoveBackward(nativeEvent)) {
      event.preventDefault()

      if (selection && SlateRange.isCollapsed(selection)) {
        Transforms.move(editor, { reverse: true })
      } else {
        Transforms.collapse(editor, { edge: 'start' })
      }

      return
    }

    if (Hotkeys.isMoveForward(nativeEvent)) {
      event.preventDefault()

      if (selection && SlateRange.isCollapsed(selection)) {
        Transforms.move(editor)
      } else {
        Transforms.collapse(editor, { edge: 'end' })
      }

      return
    }

    if (Hotkeys.isMoveWordBackward(nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'word', reverse: true })
      return
    }

    if (Hotkeys.isMoveWordForward(nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'word' })
      return
    }

    // COMPAT: Certain browsers don't support the `beforeinput` event, so we
    // fall back to guessing at the input intention for hotkeys.
    // COMPAT: In iOS, some of these hotkeys are handled in the
    if (!props.HAS_BEFORE_INPUT_SUPPORT) {
      // We don't have a core behavior for these, but they change the
      // DOM if we don't prevent them, so we have to.
      if (
        Hotkeys.isBold(nativeEvent) ||
        Hotkeys.isItalic(nativeEvent) ||
        Hotkeys.isTransposeCharacter(nativeEvent)
      ) {
        event.preventDefault()
        return
      }

      if (Hotkeys.isSplitBlock(nativeEvent)) {
        event.preventDefault()
        Editor.insertBreak(editor)
        return
      }

      if (Hotkeys.isDeleteBackward(nativeEvent)) {
        event.preventDefault()

        if (selection && SlateRange.isExpanded(selection)) {
          Editor.deleteFragment(editor)
        } else {
          Editor.deleteBackward(editor)
        }

        return
      }

      if (Hotkeys.isDeleteForward(nativeEvent)) {
        event.preventDefault()

        if (selection && SlateRange.isExpanded(selection)) {
          Editor.deleteFragment(editor)
        } else {
          Editor.deleteForward(editor)
        }

        return
      }

      if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
        event.preventDefault()

        if (selection && SlateRange.isExpanded(selection)) {
          Editor.deleteFragment(editor)
        } else {
          Editor.deleteBackward(editor, { unit: 'line' })
        }

        return
      }

      if (Hotkeys.isDeleteLineForward(nativeEvent)) {
        event.preventDefault()

        if (selection && SlateRange.isExpanded(selection)) {
          Editor.deleteFragment(editor)
        } else {
          Editor.deleteForward(editor, { unit: 'line' })
        }

        return
      }

      if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
        event.preventDefault()

        if (selection && SlateRange.isExpanded(selection)) {
          Editor.deleteFragment(editor)
        } else {
          Editor.deleteBackward(editor, { unit: 'word' })
        }

        return
      }

      if (Hotkeys.isDeleteWordForward(nativeEvent)) {
        event.preventDefault()

        if (selection && SlateRange.isExpanded(selection)) {
          Editor.deleteFragment(editor)
        } else {
          Editor.deleteForward(editor, { unit: 'word' })
        }

        return
      }
    }
  }
}
