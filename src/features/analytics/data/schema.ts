import { z } from 'zod'

const analyticsSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  projectName: z.string(),
  earnedValue: z.number().min(0),
  plannedValue: z.number().min(0),
  actualCost: z.number().min(0),
  costVariance: z.number().min(0),
  scheduleVariance: z.number().min(0),
  schedulePerformanceIndex: z.number().min(0).max(1),
  costPerformanceIndex: z.number().min(0).max(1),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Analytics = z.infer<typeof analyticsSchema>
export const analyticsListSchema = z.array(analyticsSchema)
