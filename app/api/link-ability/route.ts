import conn from "@/app/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const body = await request.json();
		const { character_id, ability_id, max_uses, available_uses, activation_count } = body;

		if (!character_id || !ability_id) {
			return NextResponse.json({ error: "Missing required fields: character_id, ability_id" }, { status: 400 });
		}

		// make sure player owns this character
		const [userCharacters] = await conn.query("SELECT id FROM Characters WHERE id = ? AND user_id = ?", [
			character_id,
			session.user.id,
		]);

		if (!Array.isArray(userCharacters) || userCharacters.length === 0) {
			return NextResponse.json({ error: "You do not have permission to modify this character" }, { status: 403 });
		}

		const [abilities] = await conn.query("SELECT id FROM Abilities WHERE id = ?", [ability_id]);

		if (!Array.isArray(abilities) || abilities.length === 0) {
			return NextResponse.json({ error: "Ability not found" }, { status: 404 });
		}

		const [existingCharacterAbility] = await conn.query(
			"SELECT character_id FROM CharacterAbilities WHERE character_id = ? AND ability_id = ?",
			[character_id, ability_id]
		);

		if (Array.isArray(existingCharacterAbility) && existingCharacterAbility.length > 0) {
			return NextResponse.json({ error: "Character already has this ability" }, { status: 409 });
		}

		await conn.query(
			"INSERT INTO CharacterAbilities (character_id, ability_id, activation_count, max_uses, available_uses) VALUES (?, ?, ?, ?, ?)",
			[
				character_id,
				ability_id,
				activation_count || 0,
				max_uses === null ? null : max_uses,
				available_uses === null ? max_uses : available_uses,
			]
		);

		return NextResponse.json(
			{ success: true, message: "Ability linked to character successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error linking ability to character:", error);
		return NextResponse.json({ error: "Failed to link ability to character" }, { status: 500 });
	}
}
