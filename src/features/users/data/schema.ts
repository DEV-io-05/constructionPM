import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('projectmanager'),
  z.literal('teammember'),
  z.literal('client'),
  z.literal('guest'),
])

const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)


// import { z } from 'zod'

// const userStatusSchema = z.union([
//   z.literal('active'),
//   z.literal('inactive'),
//   z.literal('invited'),
//   z.literal('suspended'),
// ])

// const userRoleSchema = z.union([
//   z.literal('admin'),
//   z.literal('project_manager'),
//   z.literal('team_member'),
//   z.literal('client'),
//   z.literal('guest'),
// ])

// const permissionByRoleSchema = z.object({
//   id: z.string(),
//   role: userRoleSchema,
// })

// const permissionSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   description: z.string(),
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
// })

// const userRolePermissionSchema = z.object({
//   id: z.string(),
//   role: userRoleSchema,
//   permission: permissionSchema,
// })

// export const userSchema = z.object({
//   id: z.string(),
//   firstName: z.string(),
//   lastName: z.string(),
//   username: z.string(),
//   email: z.string(),
//   phoneNumber: z.string().optional(),
//   address: z.string(),
//   status: userStatusSchema,
//   role: permissionByRoleSchema,
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
// })

// export type User = z.infer<typeof userSchema>
// export type UserStatus = z.infer<typeof userStatusSchema>
// export const UserRole = z.array(userRoleSchema)
// export const UserRolePermission = z.array(userRolePermissionSchema)
// export const userListSchema = z.array(userSchema)
