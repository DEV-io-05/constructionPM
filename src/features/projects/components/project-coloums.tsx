import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { statusProject } from '../data/data'
import { Project } from '../data/schema'
import { DataTableColumnHeader } from './data-table-coloumn-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Project>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'client ',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Client' />
    ),
    cell: ({ row }) => (
      // const project.id = row.getValue('id')
      // const client = row.getValue('role') === 'client' ? row.getValue('client') : 'N/A'
      <LongText className='max-w-36'>{''}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'nameProject',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project Name' />
    ),
    cell: ({ row }) => (
      <LongText className='font-medium'>{row.getValue('nameProject')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-[210px] md:table-cell'
      ),
    },
    enableHiding: false,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='location' />
    ),
    cell: ({ row }) => (
      <div className='max-w-32 truncate sm:max-w-72 md:max-w-[31rem]'>
        {row.getValue('location')}
      </div>
    ),
  },
  {
    accessorKey: 'statusProject',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('statusProject')
      const label = statusProject.find((s) => s.value === value)

      if (!label) return <span className='text-muted-foreground'>Unknown</span>

      const Icon = label.icon

      return (
        <div className='flex align-center items-center gap-2'>
          <Icon className='text-muted-foreground h-4 w-4' />
          <Badge variant='outline'>{label.label}</Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' />
    ),
    cell: ({ row }) => <div className='text-align-center'>{row.getValue('startDate')}</div>,
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' />
    ),
    cell: ({ row }) => <div className='text-align-center'>{row.getValue('endDate')}</div>,
  },
  {
    accessorKey: 'budget',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Budget' />
    ),
    cell: ({ row }) => (
      <div className='text-align-center'>{row.getValue('budget')}</div>
    ),
  },
  {
    accessorKey: 'progressPercent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Progress (%)' />
    ),
    cell: ({ row }) => (
      <div className='text-align-center'>{row.getValue('progressPercent')}%</div>
    ),
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Team Members' />
    ),
    cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          {(row.getValue('userId') as number[]).map((userId) => (
            <img
              key={userId}
              src={`https://i.pravatar.cc/150?img=${userId}`}
              alt={`Avatar of ${userId}`}
              className='h-8 w-8 rounded-full'
            />
          ))}
        </div>
    ),
    meta: {
      className: 'hidden md:table-cell',
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
