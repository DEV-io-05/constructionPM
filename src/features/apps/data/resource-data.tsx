import React from 'react'
import { JSX } from 'react'
import {
  IconNotes,
  IconDeviceIpadUp,
  IconDeviceIpadDown,
  IconFileCheck,
} from '@tabler/icons-react'

interface ResourceItem {
  name: string
  logo: JSX.Element
  done: boolean
  desc: string
}

export const resource: ResourceItem[] = [
  {
    name: 'todoist',
    logo: React.createElement(IconNotes),
    done: true,
    desc: '{ProjectId.name}.',
  },
  {
    name: 'completed',
    logo: React.createElement(IconFileCheck),
    done: false,
    desc: '{ProjectId.name}.',
  },
  {
    name: 'on progress',
    logo: React.createElement(IconDeviceIpadUp),
    done: true,
    desc: '{ProjectId.name}.',
  },
  {
    name: 'new resource',
    logo: React.createElement(IconDeviceIpadDown),
    done: false,
    desc: '{ProjectId.name}.',
  },
]
