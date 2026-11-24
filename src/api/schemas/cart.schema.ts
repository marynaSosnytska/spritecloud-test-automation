import { z } from 'zod'

const CartProductSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  price: z.number(),
  quantity: z.number().int(),
  total: z.number(),
  discountPercentage: z.number(),
  discountedPrice: z.number(),
  thumbnail: z.url(),
})

export const CartSchema = z.object({
  id: z.number().int(),
  products: z.array(CartProductSchema),
  total: z.number(),
  discountedTotal: z.number(),
  userId: z.number().int(),
  totalProducts: z.number().int(),
  totalQuantity: z.number().int(),
})

export type Cart = z.infer<typeof CartSchema>
