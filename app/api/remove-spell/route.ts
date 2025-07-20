import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const data = await request.json();
		const { characterId, spellId } = data;

		if (!spellId || !characterId) {
			return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
		}
		const [userCharacters] = await db.query(
			"SELECT id FROM Characters WHERE id = ? AND user_id = (SELECT id FROM Users WHERE username = ?)",
			[characterId, session.user.name]
		);

		if (!Array.isArray(userCharacters) || userCharacters.length === 0) {
			return NextResponse.json({ error: "You do not have permission to modify this character" }, { status: 403 });
		}

		await db.query("DELETE FROM CharacterSpellList WHERE character_id = ? AND spell_id = ?", [
			characterId,
			spellId,
		]);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error removing spell from character:", error);
		return NextResponse.json({ error: "Failed to remove spell from character" }, { status: 500 });
	}
}
