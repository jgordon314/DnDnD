"use client";
import { useState } from "react";
import { CharacterAbility, Ability } from "@/app/types";

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
        {rows.filter(row => row.activation_count >= 0).map(row => (
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
              <button
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  background: "#e00",
                  color: "#fff",
                  border: "none",
                  cursor: row.activation_count > 0 ? "pointer" : "default",
                  opacity: row.activation_count > 0 ? 1 : 0,
                  pointerEvents: row.activation_count > 0 ? "auto" : "none",
                  marginRight: 8,
                }}
                disabled={isPending === row.id || row.activation_count === 0}
                onClick={() => updateActivation(row.id, -1)}
              >
                -
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
