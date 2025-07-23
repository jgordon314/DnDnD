import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", body);
    const { characterId, abilityId, delta } = body;
    if (
      typeof characterId !== "number" ||
      typeof abilityId !== "number" ||
      typeof delta !== "number"
    ) {
      console.error("Invalid input types or missing abilityId. Body:", body);
      return NextResponse.json({ success: false, error: `Invalid input types or missing abilityId. Body: ${JSON.stringify(body)}` }, { status: 400 });
    }
    const updateSQL = `
      UPDATE CharacterAbilities
      SET activation_count = GREATEST(activation_count + ?, 0),
          available_uses =  max_uses - activation_count
      WHERE character_id = ? AND ability_id = ?
    `;
    const [result] = await conn.query(updateSQL, [delta, characterId, abilityId]);
    console.log("SQL result:", result);
    // mysql2 returns ResultSetHeader for UPDATE queries
    const affectedRows = (result && typeof result === 'object' && 'affectedRows' in result) ? result.affectedRows : undefined;
    if (!affectedRows) {
      return NextResponse.json({ success: false, error: "No rows updated. Check characterId and abilityId." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error in ability-activation API:", errMsg);
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
