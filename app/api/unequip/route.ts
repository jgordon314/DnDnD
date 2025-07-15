import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { characterId, itemId } = await request.json();
  const unequipSQL = `
    UPDATE CharacterInventory
    SET activation_count = -1
    WHERE character_id = ? AND item_id = ?
  `;
  await conn.query(unequipSQL, [characterId, itemId]);
  return NextResponse.json({ success: true });
}
