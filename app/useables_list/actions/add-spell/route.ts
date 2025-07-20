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

		const formData = await request.formData();
		const spellId = Number(formData.get("id"));
		const characterId = Number(formData.get("characterId"));

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

		await db.query("INSERT INTO CharacterSpellList (character_id, spell_id, activations) VALUES (?, ?, 0)", [
			characterId,
			spellId,
		]);
		return NextResponse.redirect(new URL(`/character/${characterId}`, request.url));
	} catch (error) {
		console.error("Error adding spell to character:", error);
		return NextResponse.json({ error: "Failed to add spell to character" }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const url = new URL(request.url);
		const spellId = Number(url.searchParams.get("id"));
		const characterId = Number(url.searchParams.get("characterId"));

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

		await db.query("INSERT INTO CharacterSpellList (character_id, spell_id, activations) VALUES (?, ?, 0)", [
			characterId,
			spellId,
		]);
		return NextResponse.redirect(new URL(`/character/${characterId}`, request.url));
	} catch (error) {
		console.error("Error adding spell to character:", error);
		return NextResponse.json({ error: "Failed to add spell to character" }, { status: 500 });
	}
}
