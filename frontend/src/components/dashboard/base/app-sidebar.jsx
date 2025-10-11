import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconRobot,
  IconSettings
} from "@tabler/icons-react"

import { NavMain } from "@/components/dashboard/base/nav-main"
import { NavUser } from "@/components/dashboard/base/nav-user"
import { NavSecondary } from "@/components/dashboard/base/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Overview", url: "/dashboard/overview", icon: IconDashboard },
    { title: "Analytics", url: "/dashboard/analytics", icon: IconChartBar },
    { title: "Bots", url: "/dashboard/bots", icon: IconRobot },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    }
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser user={data.user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
