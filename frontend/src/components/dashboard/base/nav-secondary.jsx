import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"

export function NavSecondary({ items, ...props }) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.url} className="w-full">
                {({ isActive }) => (
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={isActive ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "hover:bg-muted hover:text-foreground"}
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
