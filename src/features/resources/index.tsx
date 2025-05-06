import { useState } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { resource } from './data/resource-data'
import { ResourceDialog } from './components/resource-dialog'

import  ResourceDetail  from './components/resource-detail'

const resourceText = new Map<string, string>([
  ['all resource', 'All Resources'],
  ['planed', 'Planed'],
  ['on progress', 'On Progress'],
  ['done', 'Done'],
])

export default function Resource() {
  const [open, setOpen] = useState(false)
  const [resourceId, setResourceId] = useState('')
  const [resourceName, setResourceName] = useState('')
  const [sort, setSort] = useState('ascending')
  const [resourceType, setReType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredApps = resource
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((re) =>
      resourceType === 'view detail'
        ? re.done
        : resourceType === 'view detail'
          ? !re.done
          : true
    )
    .filter((re) => re.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleResourceClick = (re: any) => {
      setResourceId(re.id)
      setOpen(true)
    }
  const handleClose = () => {
    setOpen(false)
    setResourceId('')
    setResourceName('')
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Resources alocated for the project
          </h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your resources for the project!
          </p>
        </div>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'></h1>
          <div className='flex items-center space-x-2'>
          </div>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter resources...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={resourceType} onValueChange={setReType}>
              <SelectTrigger className='w-36'>
                <SelectValue>{resourceText.get(resourceType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Resources</SelectItem>
                <SelectItem value='planed'>Planed</SelectItem>
                <SelectItem value='on progress'>On Progress</SelectItem>
                <SelectItem value='done'>Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {filteredApps.map((re) => (
            <li key={re.name} className='rounded-lg border p-4 hover:shadow-md'>
              <div className='mb-8 flex items-center justify-between'>
                <div
                  className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}
                >
                  {re.logo}
                </div>
                <Button
                  onClick={() => handleResourceClick(re)}
                  variant='outline'
                  size='sm'
                  className={`${
                    re.done
                      ? 'border border-green-300 bg-green-50 hover:bg-green-100 dark:border-green-700 dark:bg-green-950 dark:hover:bg-green-900'
                      : 'border border-yellow-300 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-950 dark:hover:bg-yellow-900'
                  }`}
                >
                      View Detail
                  <span className="ml-2">
                    {re.done ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    )}
                  </span>
                </Button>
              </div>
              <div>
                <h2 className='mb-1 font-semibold'>{re.name}</h2>
                <p className='line-clamp-2 text-gray-500'>{re.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <ResourceDetail
          open={open}
          onClose={handleClose}
          resourceId={resourceId}
          resourceName={resourceName}
          // Pastikan objek sumber daya memiliki properti 'done'
          done={filteredApps.find((re) => re.id === resourceId)?.done || false}
        />
      </Main>
    </>
  )
}
