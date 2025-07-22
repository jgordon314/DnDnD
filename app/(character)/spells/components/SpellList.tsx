"use client";

import { Spell } from "../../../lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

export function SpellList({ spells }: { spells: Spell[] }) {
  return (
    <div>
      {spells.map(spell =>
        <Card className="mb-5 pr-7" key={spell.id}>
          <CardHeader>
            <CardTitle>{spell.name}</CardTitle>
            <CardDescription>{spell.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

