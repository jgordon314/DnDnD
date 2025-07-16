import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"
import { getCharactersForUser } from "@/app/lib/models/characters"
import Link from "next/link";

export async function SidebarCharacterList({ userId }: { userId: number }) {
  const characters = await getCharactersForUser(userId);

  if (!characters) {
    return null;
  }

  console.log(characters)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Characters</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          {characters.map((character) => 
            <SidebarMenuButton asChild key={character.id}>
              <Link href={`/character/${character.id}`}>{character.name}</Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
