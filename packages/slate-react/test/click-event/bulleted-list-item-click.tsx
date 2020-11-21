export const input = [{
    type: 'bulleted-list',
    children: [{ text: 'List 1' }],
  },]

export const selector = "ul"

export const output = null // clicking should not select anything, since selection only works for img types and editable voids.