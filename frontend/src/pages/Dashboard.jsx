import { AppSidebar } from "@/components/dashboard/base/app-sidebar"
import { SiteHeader } from "@/components/dashboard/base/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import {useState} from "react"

export default function Dashboard() {
  const [headerText, setHeaderText] = useState("Overview")
  const [periodSelectorActive, setPeriodSelectorActive]= useState(true)

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" headerText={setHeaderText} setPeriodSelectorActive={setPeriodSelectorActive} />
      <SidebarInset >
        <SiteHeader header={headerText} periodSelector={periodSelectorActive} />
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
