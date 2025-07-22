import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ItemList } from "./components/ItemList";
import { getItemsForEveryone } from "@/app/lib/models/items/query";



export default async function AllItems() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login?next=/items")
  }

  const items = await getItemsForEveryone()

  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-3xl">All Items</h1>
      <ItemList items={items}></ItemList>
      <Link href="/items/new">
        <Button>Add New Item</Button>
      </Link>
    </div>
  )
}
