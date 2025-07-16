import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/app/components/ui/sidebar";
import Link from "next/link";

export function SidebarTop() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <Link href="/">
              <span className="text-base font-semibold">DDD</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      
    </SidebarHeader>
  )
}
