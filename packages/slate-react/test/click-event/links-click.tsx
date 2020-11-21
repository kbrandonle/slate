export const input = [{
    type: 'link',
    url: 'https://en.wikipedia.org/wiki/Hypertext',
    children: [{ text: 'hyperlinks' }],
  },]

export const selector = "a"

export const output = null // clicking should not select anything, since selection only works for img types and editable voids.