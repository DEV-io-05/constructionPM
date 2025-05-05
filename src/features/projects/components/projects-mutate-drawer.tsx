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
import { useEffect } from 'react'
import { statusProject } from '../data/data'

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
  const { addProject, updateProject } = useProjects()

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    values: currentRow || {
      id: '', // Consider generating a UUID here if your backend doesn't handle it
      clientId: '',
      nameProject: '', // Changed to match schema
      description: '',
      startDate: '', // Changed to match schema
      endDate: '', // Changed to match schema
      budget: '', // Changed to match schema
      budgetType: 'fixed', // Default value
      currency: 'IDR', // Default value
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
      form.reset(currentRow)
    } else {
      form.reset(form.getValues() as ProjectFormData)
    }
  }, [currentRow, form])

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const processedData: Project = {
        ...data,
        budget: Number(data.budget),
      }

      if (currentRow) {
        // Update existing project
        await updateProject(processedData)
        toast.success('Project updated successfully!')
      } else {
        // Create new project
        await addProject(processedData)
        toast.success('Project created successfully!')
      }

      onOpenChange(false) // Close the drawer on success
    } catch (error: unknown) {
      toast.error(
        (error as { message?: string })?.message || 'An error occurred while submitting the project.'
      )
    }
  }

  useEffect(() => {
    if (currentRow) {
      form.reset({
        ...currentRow,
        startDate: currentRow.startDate ? new Date(currentRow.startDate).toISOString().split('T')[0] : '',
        endDate: currentRow.endDate ? new Date(currentRow.endDate).toISOString().split('T')[0] : '',
      });
    } else {
      form.reset(form.getValues() as ProjectFormData);
    }
  }, [currentRow, form])


  const { userInfo } = useProjects()
  const userOptions = userInfo.map((user) => ({
    value: user.id,
    label: user.name,
  }))
  const statusOptions = statusProject.map((status) => ({
    value: status.value,
    label: status.label,
  }))

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
          <Form {...form}>
              <FormField
                control={form.control} 
                name='clientId'
                render={({ field }) => (
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        >
                        <SelectTrigger>
                          <SelectValue  placeholder='Select client' /> 
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
                  <FormItem className='flex flex-col items-center'>
                    <FormLabel className='mb-1 w-full text-left'>
                      Name
                    </FormLabel>
                    <FormControl className='w-full'>
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
                  <FormItem className='flex flex-col items-center'>
                    <FormLabel className='mb-1 w-full text-left'>
                      Description
                    </FormLabel>
                    <FormControl className='w-full'>
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
                    <FormItem className='flex flex-col items-center'>
                      <FormLabel className='mb-1 w-full text-left'>
                        Start Date
                      </FormLabel>
                      <FormControl className='w-full'>
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
                    <FormItem className='flex flex-col items-center'>
                      <FormLabel className='mb-1 w-full text-left'>
                        End Date
                      </FormLabel>
                      <FormControl className='w-full'>
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
                  <FormItem className='flex flex-col items-center'>
                    <FormLabel className='mb-1 w-full text-left'>
                      Budget
                    </FormLabel>
                    <FormControl className='w-full'>
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
                  <FormItem className='flex flex-col'>
                    <FormLabel>Status</FormLabel>
                    <FormControl className='w-full'>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' /> 
                        </SelectTrigger>
                        <SelectContent>
                          {statusProject.map((statusProject) => (
                            <SelectItem key={statusProject.value} value={statusProject.value}>
                              {statusProject.label}
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
                name='teamMembers' 
                render={({ field }) => (
                  <>
                    <PopoverAsignUser
                      trigger='click'
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder='Select team members'
                      renderValue={(value: any) => {
                        if (value.length === 0) return 'Select team members'
                        return value.join(', ') 
                      }}
                      />
                    <FormMessage />
                  </>
                )}
              />
              </div>
              <div className='mx-auto flex max-w-md justify-between gap-4 pt-6'>
                <Button type='submit' className='flex-1' onClick={form.handleSubmit(onSubmit)}>
                  {currentRow ? 'Update' : 'Create'}
                </Button>
              </div>
          </Form> 
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
