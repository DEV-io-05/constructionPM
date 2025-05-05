import { z } from 'zod'

export const projectSchema = z.object({
  id: z.string(), // changed from z.string().uuid() to z.string() to match data
  clientId: z.string(), // changed from z.string().uuid() to z.string() to match data
  nameProject: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Start date must be a valid ISO string',
  }), // changed from z.string().refine((date) => !isNaN(Date.parse(date))) to z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Start date must be a valid ISO string' })
  // startDate and endDate for indicator progress project and task and then calculate the progress percent and this = indicator precent progress for calculated indicator core EVM
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'End date must be a valid ISO string',
  }),
  budget: z.number(), // changed from z.number(z.string()) to z.number() to match data  this = BAC indicator fix for calculated indicator core EVM
  budgetType: z.union([z.literal('fixed'), z.literal('variable')]), // changed from z.string() to z.enum()
  currency: z.enum(['IDR']), // changed from z.string() to z.enum()
  statusProject: z.union([
    z.literal('backlog'),
    z.literal('todo'),
    z.literal('in_progress'),
    z.literal('completed'),
    z.literal('canceled'),
  ]), // changed from z.string() to z.enum() for matching data
  progressPercentProject: z.number().min(0).max(100).optional(), // calculated field by progress project and group tasks progress
  userId: z.array(z.string()), // assign to users base on id specialy for Client, Project Manager, team membersand other users
  taskId: z.array(z.string()), // included assign a tasks WBS base on id grouped taskwith a specific project and this = WBS indicator for calculated indicator core EVM
  resourceId: z.array(z.string()), // assigned to a resources base on id resource eng. material, tools, worker and other with a specific project
  evmRecordId: z.array(z.string()).optional(), // earned value management record overview specific project
  createdAt: z.coerce.date(), // fixed missing closing parenthesis
  updatedAt: z.coerce.date(), // fixed missing closing parenthesis
})

export type Project = z.infer<typeof projectSchema>

export const projectListSchema = z.array(projectSchema)

// export type UserRolePermission = z.infer<typeof UserRolePermission>

// must be input for feat CRUD is startDate, endDate, budget, budgetType, currency, projectStatus, teamMembers, taskId, resourceId
