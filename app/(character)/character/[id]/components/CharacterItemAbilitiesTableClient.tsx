"use client";
import { useState } from "react";
import { CharacterAbility, Ability } from "@/app/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";

interface Props {
  rows: (Ability & CharacterAbility)[];
  characterId: number;
}

export function CharacterItemAbilitiesTableClient({ rows: initialRows, characterId }: Props) {
  const [rows, setRows] = useState<(Ability & CharacterAbility)[]>(initialRows);
  const [isPending, setPending] = useState<number | null>(null);

  async function updateActivation(itemAbilityId: number, delta: number) {
    setPending(itemAbilityId);
    await fetch("/api/item-ability-activation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId, itemAbilityId, delta })
    });
    setRows(prevRows => prevRows.map(row => {
      if (row.id === itemAbilityId) {
        return { ...row, activation_count: row.activation_count + delta };
      }
      return row;
    }));
    setPending(null);

    window.location.reload();
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item Ability Name</TableHead>
          <TableHead>Activation Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.filter(row => row.activation_count >= 0).map(row => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>
              <div
                className="flex w-full max-w-sm items-center gap-2"
              >
                <Button
                  variant="ghost"
                  disabled={isPending === row.id || row.activation_count === 0}
                  onClick={() => updateActivation(row.id, -1)}
                >-</Button>
                <div>{row.activation_count}</div>
                <Button
                  variant="ghost"
                  disabled={isPending === row.id}
                  onClick={() => updateActivation(row.id, 1)}
                >+</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
