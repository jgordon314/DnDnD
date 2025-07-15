import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { characterId, itemAbilityId, delta } = await request.json();
  const updateSQL = `
    UPDATE CharacterInventory ci
    JOIN Items i ON ci.item_id = i.id
    SET ci.activation_count = ci.activation_count + ?
    WHERE ci.character_id = ? AND i.ability_id = ?
  `;
  await conn.query(updateSQL, [delta, characterId, itemAbilityId]);
  return NextResponse.json({ success: true });
}
