import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table-project'
import { columns } from './components/project-coloums'
import { ProjectsDialogs } from './components/projects-dialog'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import ProjectsProvider from './context/projects-contex'
import { projects } from './data/projects'

export default function Projects() {
  return (
    <ProjectsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your Projects!
            </p>
          </div>
          <ProjectsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable data={projects} columns={columns} />
        </div>
      </Main>

      <ProjectsDialogs />
    </ProjectsProvider>
  )
}
