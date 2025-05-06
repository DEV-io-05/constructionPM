import { z } from 'zod'

const typeResourceSchema = z.union([
  z.literal('worker'),
  z.literal('material'),
  z.literal('equipment'),
  z.literal('other'),
])

const availabilityResourceSchema = z.object({
  id: z.string(),
  processId: z.string(),
  startDateResource: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Start date must be a valid ISO string',
  }),
  endDateResource: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'End date must be a valid ISO string',
  }),
  quantity: z.number().min(1),
  unitCost: z.number().min(0),
  totalCost: z.number().min(0),
  currency: z.enum(['IDR']),
})

const resourceSchema = z.object({
  id: z.string(),
  nameResource: z.string(),
  typeResource: typeResourceSchema,
  description: z.string().optional(),
  units: z.string(),
  unitCost: z.number().min(0),
  statusResource: z.union([
    z.literal('available'),
    z.literal('unavailable'),
    z.literal('reserved'),
    z.literal('in_use'),
  ]),
  availability: z.array(availabilityResourceSchema),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Created at must be a valid ISO string',
  }),
  updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Updated at must be a valid ISO string',
  }),
})

export type Resource = z.infer<typeof resourceSchema>
export type statusResource = z.infer<typeof resourceSchema>['statusResource']
export type TypeResource = z.infer<typeof typeResourceSchema>

export const resourceListSchema = z.array(resourceSchema)
