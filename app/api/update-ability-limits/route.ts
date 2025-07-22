import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const { characterId, abilityId, maxUses, availableUses } = await request.json();

		if (!characterId || !abilityId) {
			return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
		}

		const [userCharacters] = await db.query(
			"SELECT id FROM Characters WHERE id = ? AND user_id = (SELECT id FROM Users WHERE username = ?)",
			[characterId, session.user.username]
		);

		if (!Array.isArray(userCharacters) || userCharacters.length === 0) {
			return NextResponse.json({ error: "You do not have permission to modify this character" }, { status: 403 });
		}

		await db.query(
			"UPDATE CharacterAbilities SET max_uses = ?, available_uses = ? WHERE character_id = ? AND ability_id = ?",
			[maxUses, availableUses, characterId, abilityId]
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error updating ability limits:", error);
		return NextResponse.json({ error: "Failed to update ability limits" }, { status: 500 });
	}
}
