export const input = [{
    type: 'check-list-item',
    checked: true,
    children: [{ text: 'Criss-cross!' }],
  },]

export const selector = "p"

export const output = null // clicking should not select anything, since selection only works for img types and editable voids.