import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      {/* SidebarFooter can be added here if needed */}
      {/* Uncomment the following line to include SidebarFooter */}
      {/* <SidebarFooter /> */}
    </Sidebar>
  )
}
