"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"
import { Character } from "@/app/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarCharacterList({ characters }: { characters: Character[] }) {
  const pathname = usePathname()
  
  if (!characters) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Characters</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          {characters.map((character) => 
            <SidebarMenuButton asChild key={character.id} isActive={pathname === `/character/${character.id}`} className="my-1">
              <Link href={`/character/${character.id}`}>{character.name}</Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
