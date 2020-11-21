export const input = [{
    type: 'list-item',
    children: [{ text: 'Item 1' }],
  },]

export const selector = "li"

export const output = null // clicking should not select anything, since selection only works for img types and editable voids.