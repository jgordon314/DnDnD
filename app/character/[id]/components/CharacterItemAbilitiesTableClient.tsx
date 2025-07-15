"use client";
import { useState } from "react";
import { CharacterAbility, Ability } from "@/app/types";

interface Props {
  rows: (Ability & CharacterAbility)[];
  characterId: number;
}

export function CharacterItemAbilitiesTableClient({ rows, characterId }: Props) {
  const [isPending, setPending] = useState<number | null>(null);

  async function updateActivation(itemAbilityId: number, delta: number) {
    setPending(itemAbilityId);
    await fetch("/api/item-ability-activation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId, itemAbilityId, delta })
    });
    window.location.reload();
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Item Ability Name</th>
          <th>Activation Count</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.activation_count}</td>
            <td>
              <button
                style={{ marginRight: 8, padding: "4px 12px", borderRadius: 6, background: "#0070f3", color: "#fff", border: "none", cursor: "pointer" }}
                disabled={isPending === row.id}
                onClick={() => updateActivation(row.id, 1)}
              >
                +
              </button>
              {row.activation_count > 0 && (
                <button
                  style={{ padding: "4px 12px", borderRadius: 6, background: "#e00", color: "#fff", border: "none", cursor: "pointer" }}
                  disabled={isPending === row.id}
                  onClick={() => updateActivation(row.id, -1)}
                >
                  -
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
