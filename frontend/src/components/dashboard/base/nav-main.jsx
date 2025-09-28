import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"

export function NavMain({ items, setHeader, setPeriodSelectorActive }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.url} className="w-full">
                {({ isActive }) => (
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    onClick={() => {
                      if(item.title === "Bots") {
                        setPeriodSelectorActive(false)
                      } else {
                        setPeriodSelectorActive(true)
                      }
                      setHeader(item.title)
                    }}
                    className={isActive ? "bg-primary text-white hover:bg-primary hover:text-white" : "hover:bg-muted hover:text-foreground"}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
