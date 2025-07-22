import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { getSpellsForEveryone } from "@/app/lib/models/spells/query";
import { SpellList } from "./components/SpellList";



export default async function AllSpells() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login?next=/spells")
  }

  const spells = await getSpellsForEveryone()

  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-3xl">All Spells</h1>
      <SpellList spells={spells}></SpellList>
      <Link href="/spells/new">
        <Button>Add New Spell</Button>
      </Link>
    </div>
  )
}
