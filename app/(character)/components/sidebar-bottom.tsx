"use client";

import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/app/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { ChevronUp, User2 } from "lucide-react"
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export function SidebarBottom({
  username
}: {
  username: string;
}) {
  async function signOutAndRedirect() {
    await signOut({
      redirect: false,
    });

    redirect("/");
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> {username}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem onClick={() => signOutAndRedirect()}>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
