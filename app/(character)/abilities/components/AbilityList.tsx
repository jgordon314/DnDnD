"use client";

import { Ability, Spell } from "../../../lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

export function AbilityList({ abilities }: { abilities: Ability[] }) {
  return (
    <div>
      {abilities.map(ability =>
        <Card className="mb-5 pr-7" key={ability.id}>
          <CardHeader>
            <CardTitle>{ability.name}</CardTitle>
            <CardDescription>{ability.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

