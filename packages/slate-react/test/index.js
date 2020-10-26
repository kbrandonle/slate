import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { isImageUrl, nonAsyncIsHeaderImage } from './imageexample/images'

describe('slate-react', () => {
  fixtures(__dirname, 'selection', ({ module }) => {
    let { input, test, output } = module
    if (Editor.isEditor(input)) {
      input = withTest(input)
    }
    const result = test(input)
    expect(result).toEqual(output)
  })

  //tests is image url function
  fixtures(__dirname, 'imageurls', ({ module }) => {
    let { input, imageUrl } = module
  
    expect(isImageUrl(input)).toEqual(imageUrl)
  })

  //tests is header image function
  fixtures(__dirname, 'imageurls', ({ module }) => {
    let { input, headerImage } = module
  
    expect(nonAsyncIsHeaderImage(input)).toEqual(headerImage)
  })
})
const withTest = editor => {
  const { isInline, isVoid } = editor
  editor.isInline = element => {
    return element.inline === true ? true : isInline(element)
  }
  editor.isVoid = element => {
    return element.void === true ? true : isVoid(element)
  }
  return editor
}
