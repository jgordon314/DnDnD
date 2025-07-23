"use client"

import { Button } from "@/app/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"
import { ChevronDown, CirclePlus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SidebarActions() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="New"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <CirclePlus />
                  <span>New</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link
                  href="/characters/new"
                >
                  <DropdownMenuItem>
                    <span>New Character</span>
                  </DropdownMenuItem>
                </Link>
                <Link
                  href="/items/new"
                >
                  <DropdownMenuItem>
                    <span>New Item</span>
                  </DropdownMenuItem>
                </Link>
                <Link
                  href="/spells/new"
                >
                  <DropdownMenuItem>
                    <span>New Spell</span>
                  </DropdownMenuItem>
                </Link>
                <Link
                  href="/abilities/new"
                >
                  <DropdownMenuItem>
                    <span>New Ability</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === "/characters"} asChild>
              <Link href="/characters">My Characters</Link>
            </SidebarMenuButton>
            <SidebarMenuButton isActive={pathname === "/items"} asChild>
              <Link href="/items">All Items</Link>
            </SidebarMenuButton>
            <SidebarMenuButton isActive={pathname === "/spells"} asChild>
              <Link href="/spells">All Spells</Link>
            </SidebarMenuButton>
            <SidebarMenuButton isActive={pathname === "/abilities"} asChild>
              <Link href="/abilities">All Abilities</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
