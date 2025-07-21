import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { characterId } = await request.json();

  // individual SQL queries
  const resetItemsSQL = `
    UPDATE CharacterInventory
       SET activation_count = 0
     WHERE character_id = ?
       AND activation_count > 0
  `;

  const resetAbilitiesSQL = `
    UPDATE CharacterAbilities
       SET activation_count   = 0,
           available_uses     = max_uses
     WHERE character_id = ?
  `;

  const resetSpellsSQL = `
    UPDATE CharacterSpellList
       SET activations = 0
     WHERE character_id = ?
  `;

  const resetHealthSQL = `
    UPDATE SkillDeltas s
    JOIN   Characters  c ON c.base_stat_id = s.id
       SET s.current_health = s.max_health
     WHERE c.id = ?
  `;

  try {
    await conn.beginTransaction();
    // Want to use a transaction here to ensure that all queries complete together

    await conn.query(resetItemsSQL,     [characterId]); // run all SQL queries
    await conn.query(resetAbilitiesSQL, [characterId]);
    await conn.query(resetSpellsSQL,    [characterId]);
    await conn.query(resetHealthSQL,    [characterId]);

    await conn.commit(); // commit the changes once all the queries are done (ensures they all ran successfully)
    return NextResponse.json({ success: true });
  } catch (err) {
    await conn.rollback(); // remove queries that did finish
    console.error("Character reset failed:", err);
    return NextResponse.json(
      { success: false, message: "Failed to reset character resources." },
      { status: 500 }
    );
  }
}
