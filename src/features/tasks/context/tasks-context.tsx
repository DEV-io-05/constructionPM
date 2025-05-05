import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Task } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  updateTaskProgress: (taskId: string, progressPercent: number) => void
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

interface Props {
  children: ReactNode
  initialTasks?: Task[]
}

export default function TasksProvider({ children, initialTasks = [] }: Props) {
  const [open, setOpen] = useState<TasksDialogType | null>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task])
  }

  const updateTask = (task: Task) => {
    const updateRecursive = (tasksList: Task[]): Task[] => {
      return tasksList.map((t) => {
        if (t.id === task.id) {
          return { ...t, ...task }
        }
        if (t.subTasks && t.subTasks.length > 0) {
          return { ...t, subTasks: updateRecursive(t.subTasks) }
        }
        return t
      })
    }
    setTasks((prev) => updateRecursive(prev))
  }

  const deleteTask = (taskId: string) => {
    const deleteRecursive = (tasksList: Task[], id: string): Task[] => {
      return tasksList
        .filter((t) => t.id !== id)
        .map((t) => ({
          ...t,
          subTasks: t.subTasks ? deleteRecursive(t.subTasks, id) : [],
        }))
    }
    setTasks((prev) => deleteRecursive(prev, taskId))
  }

  const updateTaskProgress = (taskId: string, progressPercent: number) => {
    const updateProgressRecursive = (tasksList: Task[]): Task[] => {
      return tasksList.map((t) => {
        if (t.id === taskId) {
          return { ...t, progressPercent }
        }
        if (t.subTasks && t.subTasks.length > 0) {
          return { ...t, subTasks: updateProgressRecursive(t.subTasks) }
        }
        return t
      })
    }
    setTasks((prev) => updateProgressRecursive(prev))
  }

  return (
    <TasksContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        updateTaskProgress,
        setTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}
