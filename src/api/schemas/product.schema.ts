import { z } from 'zod'

const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
})

const ReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.iso.datetime(),
  reviewerName: z.string(),
  reviewerEmail: z.email(),
})

const MetaSchema = z.object({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  barcode: z.string(),
  qrCode: z.url(),
})

export const ProductSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number().int(),
  tags: z.array(z.string()),
  brand: z.string(),
  sku: z.string(),
  weight: z.number(),
  dimensions: DimensionsSchema,
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),
  reviews: z.array(ReviewSchema),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number().int(),
  meta: MetaSchema,
  images: z.array(z.url()),
  thumbnail: z.url(),
})

export const DeletedProductSchema = ProductSchema.extend({
  isDeleted: z.literal(true),
  deletedOn: z.iso.datetime(),
})

export type Product = z.infer<typeof ProductSchema>
export type DeletedProduct = z.infer<typeof DeletedProductSchema>
