import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { Separator } from "../components/ui/separator"
import { Path } from "./components/path"
import { SidebarBottom } from "./components/sidebar-bottom"
import { auth } from "../lib/auth";
import { redirect } from "next/navigation";
import { SidebarTop } from "./components/sidebar-top";
import { SidebarActions } from "./components/sidebar-actions";
import { SidebarCharacterList } from "./components/sidebar-character-list";
import { getCharactersForUser } from "../lib/models/characters";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

	if (!session) {
		redirect("/auth/login?next=/characters")
	} 

  const characters = await getCharactersForUser(session.user.id);

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarTop />
        <SidebarContent>
          <SidebarActions />
          <SidebarCharacterList characters={characters} />
        </SidebarContent>
        <SidebarBottom username={session.user.username} />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Path characters={characters} />
        </header>
        <div className="m-12">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
