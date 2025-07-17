import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { characterId, itemId } = await request.json();
  const equipSQL = `
    UPDATE CharacterInventory
    SET activation_count = 0
    WHERE character_id = ? AND item_id = ?
  `;
  await conn.query(equipSQL, [characterId, itemId]);
  return NextResponse.json({ success: true });
}
