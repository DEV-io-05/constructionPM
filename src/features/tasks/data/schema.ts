// This file contains the schema for the task data
// support WBS = Work Breakdown Structure
import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string(),
  projectId: z.string(), // changed from z.string().uuid() to z.string() to match data and matched with Project.id
  parentTaskId: z.string().nullable().optional(),
  subTasks: z.array(z.string()).default([]),
  nameTask: z.string(),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Start date must be a valid ISO string',
  }), // changed from z.string().refine((date) => !isNaN(Date.parse(date))) to z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Start date must be a valid ISO string' })
  // startDate and endDate for indicator progress project and task and then calculate the progress percent and this = indicator precent progress for calculated indicator core EVM
  // for startDate do not less/mins with startDate project but allowed to equal than startDate project and do not max endDate project (max = alert)
  // for startDate in parenTask do not less/mins with startDate project or task but allowed to equal than sratDate project or task and do not max endDate project (max = alert)
  // for startDate in subTask do not less/mins with startDate parentTask or project but allowed to equal than startDate parentTask and so not max endDate project (max = alert)

  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'End date must be a valid ISO string',
  }), // changed from z.string().refine((date) => !isNaN(Date.parse(date))) to z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'End date must be a valid ISO string' })
  // endDate for indicator progress project and task and then calculate the progress percent and this = indicator precent progress for calculated indicator core EVM
  // for endDate do not equal or less than startDate project or task but allowed to equal or max with endDate project
  // for endDate in parentTask do not equal or less than startDate project or task but allowed to equal or max with endDate project
  // for endDate in subTask do not equal or less than startDate parentTask or project but allowed to equal or max with endDate project
  // and do not max endDate project (max = alert)

  budgetTask: z.number(), // changed from z.number(z.string()) to z.number() to match data
  // for budgetTask do not over value with budget project
  // for budgetTask in parentTask do not over value with budget project
  // for budgetTask in subTask do not over value with budget project
  // and do not over value with budgetTask parentTask (max = alert)
  // and do not over value with budgetTask project (max = alert) high critical notification alerts
  statusTask: z.union([
    z.literal('backlog'),
    z.literal('todo'),
    z.literal('completed'),
    z.literal('canceled'),
    z.literal('in_progress'),
  ]),
  priorityTask: z.union([
    z.literal('low'),
    z.literal('medium'),
    z.literal('high'),
  ]), // changed from z.string() to z.enum()
  // for priorityTask if parentTask is selected high then subTask must be high or can be medium or low but alerts notification
  // for priorityTask if parentTask is selected medium then subTask must be medium or can be low and if high selected alerts notification
  // for priorityTask if parentTask is selected low then subTask must be low and if medium or high selected alerts notification
  progressTask: z.number().min(0).max(100).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
