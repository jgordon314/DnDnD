import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { characterId } = await request.json();
  const resetItemsSQL = `
    UPDATE CharacterInventory
    SET activation_count = 0
    WHERE character_id = ? AND activation_count > 0
  `;
  await conn.query(resetItemsSQL, [characterId]);
    const resetAbilitiesSQL = `
    UPDATE CharacterAbilities
    SET activation_count = 0,
        available_uses = max_uses
    WHERE character_id = ?
  `;
  await conn.query(resetAbilitiesSQL, [characterId]);
  const resetSpellsSQL = `
    UPDATE CharacterSpellList
    SET activations = 0
    WHERE character_id = ?
  `;
  await conn.query(resetSpellsSQL, [characterId]);
  const resetHealthSQL = `
    UPDATE Characters c
    JOIN SkillDeltas s ON c.base_stat_id=s.id
    SET s.current_health = s.max_health
    WHERE c.id = ?
  `;
  await conn.query(resetHealthSQL, [characterId]);


  return NextResponse.json({ success: true });
}
