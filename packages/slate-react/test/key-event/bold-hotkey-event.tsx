import Hotkeys from '../../src/utils/hotkeys'

export const event = new KeyboardEvent('keypress', {ctrlKey : true ,bubbles: true, key : 'b'})

export const functionArray = [e => Hotkeys.isBold(e), e => Hotkeys.isItalic(e), e => Hotkeys.isCompose(e), e => Hotkeys.isMoveBackward(e), 
    e => Hotkeys.isMoveForward(e), e => Hotkeys.isDeleteBackward(e), e => Hotkeys.isDeleteForward(e), e => Hotkeys.isDeleteLineBackward(e), 
    e => Hotkeys.isDeleteLineForward(e), e => Hotkeys.isDeleteWordBackward(e), e => Hotkeys.isExtendBackward(e),
    e => Hotkeys.isDeleteWordForward(e),e => Hotkeys.isExtendForward(e), e => Hotkeys.isExtendLineBackward(e), e => Hotkeys.isExtendLineForward(e), 
    e => Hotkeys.isMoveLineBackward(e), e => Hotkeys.isMoveLineForward(e), e => Hotkeys.isMoveWordBackward(e), e => Hotkeys.isMoveWordForward(e), 
    e => Hotkeys.isRedo(e), e => Hotkeys.isSplitBlock(e), e => Hotkeys.isTransposeCharacter(e), e => Hotkeys.isUndo(e)]

export const output = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 
    false, false, false]