import {
  IconCircle,
  IconCircleDashed,
  IconCircleX,
  IconExclamationCircle,
} from '@tabler/icons-react'

export const statusProject = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: IconExclamationCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: IconCircle,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: IconCircleDashed,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: IconCircleX,
  },
]
