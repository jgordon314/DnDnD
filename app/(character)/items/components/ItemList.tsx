"use client";

import { Item } from "../../../lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

export function ItemList({ items }: { items: Item[] }) {
  console.log(items)
  return (
    <div>
      {items.map(character =>
        <Card className="mb-5 pr-7" key={character.id}>
          <CardHeader>
            <CardTitle>{character.name}</CardTitle>
            <CardDescription>{character.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

