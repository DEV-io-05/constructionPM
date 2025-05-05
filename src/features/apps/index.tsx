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

const resourceText = new Map<string, string>([
  ['all resource', 'All Resources'],
  ['planed', 'Planed'],
  ['on progress', 'On Progress'],
  ['done', 'Done'],
])

export default function Resource() {
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
            <Button>Relocated resource</Button>
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
                  variant='outline'
                  size='sm'
                  className={`${re.done ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                >
                  {re.done ? 'view detail' : 'view detail'}
                </Button>
              </div>
              <div>
                <h2 className='mb-1 font-semibold'>{re.name}</h2>
                <p className='line-clamp-2 text-gray-500'>{re.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Main>
    </>
  )
}
