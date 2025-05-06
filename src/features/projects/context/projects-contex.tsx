import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Project } from '../data/schema'

type ProjectsDialogType = 'create' | 'edit' | 'delete'

interface ProjectsContextType {
  open: ProjectsDialogType | null
  setOpen: (str: ProjectsDialogType | null) => void
  currentRow: Project | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Project | null>>
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  deleteProject: (id: string) => void
  userInfo: Project[]
}

const ProjectsContext = React.createContext<ProjectsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProjectsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProjectsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Project | null>(null)
  const [project, setProjects] = useState<Project[]>([])
  const [userInfo, setUserInfo] = useState<Project[]>([])


  const addProject = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject])
    setCurrentRow(null)
  }

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    )
    setCurrentRow(null)
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
    setCurrentRow(null)
  }

  return (
    <ProjectsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        addProject,
        updateProject,
        deleteProject,
        userInfo,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => {
  const projectsContext = React.useContext(ProjectsContext)

  if (!projectsContext) {
    throw new Error('useProjects has to be used within <ProjectsContext>')
  }

  return projectsContext
}
