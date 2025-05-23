import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { priorityTask, statusTask } from '../data/data'
import { Task } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Task>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Task' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nameTask',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <div className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
        {row.getValue('nameTask')}
      </div>
    ),
  },
  {
    accessorKey: 'statusTask',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statusTask.find(
        (status) => status.value === row.getValue('statusTask')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='text-muted-foreground mr-2 h-4 w-4' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priorityTask',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = priorityTask.find(
        (priority) => priority.value === row.getValue('priorityTask')
      )

      if (!priority) {
        return null
      }

      return (
        <div className='flex items-center'>
          {priority.icon && (
            <priority.icon className='text-muted-foreground mr-2 h-4 w-4' />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
