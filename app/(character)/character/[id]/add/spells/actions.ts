"use server";

import { revalidatePath } from "next/cache";
import db from "../../../../../lib/db";
import { redirect } from "next/navigation";

export async function addSpellToCharacter(formData: FormData) {
	const spellId = Number(formData.get("id"));
	const characterId = Number(formData.get("characterId"));

	if (!spellId || !characterId) {
		console.error("Missing required parameters");
		return;
	}

	try {
		await db.query("INSERT INTO CharacterSpellList (character_id, spell_id, activations) VALUES (?, ?, 0)", [
			characterId,
			spellId,
		]);
		revalidatePath(`/character/${characterId}`);
	} catch (error) {
		console.error("Error adding spell to character:", error);
		return;
	}

	redirect(`/character/${characterId}`);
}
