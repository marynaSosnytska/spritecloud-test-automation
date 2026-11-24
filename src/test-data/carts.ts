export type CartProductRequest = { id: number; quantity: number }

export const cartProducts: CartProductRequest[] = [
  { id: 1, quantity: 2 },
  { id: 2, quantity: 1 },
  { id: 3, quantity: 3 },
]

// dummyjson rounds discounted prices to whole units
export const DISCOUNT_ROUNDING_TOLERANCE = 1
