import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [activeTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <div className='text-muted-foreground text-xs font-medium'>
        <SidebarMenuButton
          size='lg'
          className='bg-sidebar-accent text-sidebar-accent-foreground'
        >
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
            <activeTeam.logo className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            {activeTeam.name}
          </div>
          <ChevronsUpDown className='ml-auto' />
        </SidebarMenuButton>
      </div>
    </SidebarMenu>
  )
}
