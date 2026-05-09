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
import { useAuth } from "@/context/AuthContext"

const navData = {
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
  const { user } = useAuth()

  const displayUser = {
    name: user?.email?.split("@")[0] || "User",
    email: user?.email || "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser user={displayUser} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
