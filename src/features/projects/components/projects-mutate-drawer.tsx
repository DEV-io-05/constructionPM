import * as React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useProjects } from '../context/projects-contex'
import { projectSchema, Project } from '../data/schema'
import { PopoverAsignUser } from './popover-asign-user'
import { toast } from "sonner"

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectsMutateDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Project | null
}

export function ProjectsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: ProjectsMutateDrawerProps) {
  const { addProject, updateProject, userInfo } = useProjects()

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    values: currentRow || {
      id: '',
      clientId: '',
      nameProject: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      budgetType: 'fixed',
      currency: 'IDR',
      statusProject: '',
      progressPercentProject: 0,
      userId: [],
      taskId: [],
      resourceId: [],
      evmRecordId: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  })

  React.useEffect(() => {
    if (currentRow) {
      form.reset({
        ...currentRow,
        startDate: currentRow.startDate?.split('T')[0] ?? '',
        endDate: currentRow.endDate?.split('T')[0] ?? '',
      })
    } else {
      form.reset(form.getValues())
    }
  }, [currentRow, form])

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const processedData: Project = {
        ...data,
        budget: Number(data.budget),
      }

      if (currentRow) {
        await updateProject(processedData)
        toast.success('Project updated successfully!')
      } else {
        await addProject(processedData)
        toast.success('Project created successfully!')
      }

      onOpenChange(false)
    } catch (error: unknown) {
      toast.error(
        (error as { message?: string })?.message || 'An error occurred while submitting the project.'
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='right-0 max-w-sm sm:max-w-xl'>
        <SheetHeader className='mb-6'>
          <SheetTitle className='mb-2 text-2xl font-semibold'>
            {currentRow ? 'Edit Project' : 'New Project'}
          </SheetTitle>
          <SheetDescription className='text-muted-foreground mb-6 text-base'>
            {currentRow
              ? 'Make it happen for brain New project'
              : 'Nicely to get started project and make money!'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='clientId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select client' />
                      </SelectTrigger>
                      <SelectContent>
                        {userInfo.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='nameProject'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Project name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Project description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='budget'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='statusProject'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                        <SelectContent>
                          {statusProject.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Members</FormLabel>
                    <PopoverAsignUser
                      trigger='click'
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder='Select team members'
                      renderValue={(value: any) =>
                        value.length === 0 ? 'Select team members' : value.join(', ')
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='mx-auto flex max-w-md justify-between gap-4 pt-6'>
              <Button type='submit' className='flex-1'>
                {currentRow ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
