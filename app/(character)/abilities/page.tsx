import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { getAbilitiesForEveryone } from "@/app/lib/models/abilities/query";
import { AbilityList } from "./components/AbilityList";



export default async function AllAbilities() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login?next=/abilities")
  }

  const abilities = await getAbilitiesForEveryone()

  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-3xl">All Abilities</h1>
      <AbilityList abilities={abilities}></AbilityList>
      <Link href="/abilities/new">
        <Button>Add New Ability</Button>
      </Link>
    </div>
  )
}
