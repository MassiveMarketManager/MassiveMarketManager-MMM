import { AppSidebar } from "@/components/dashboard/base/app-sidebar"
import { SiteHeader } from "@/components/dashboard/base/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Outlet, useLocation  } from "react-router-dom"

export default function Dashboard() {

  const location = useLocation()

  const getHeaderConfig = (path) => {
    switch (path) {
      case "/dashboard/overview":
        return { text: "Overview", showSelector: true }
      case "/dashboard/bots":
        return { text: "Bots", showSelector: false }
      case "/dashboard/analytics":
        return { text: "Analytics", showSelector: true }
      default:
        return { text: "Dashboard", showSelector: false }
    }
  }

  const { text, showSelector } = getHeaderConfig(location.pathname)

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset >
        <SiteHeader header={text} periodSelector={showSelector} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet/>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
