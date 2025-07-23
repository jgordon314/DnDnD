"use server";

import db from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addAbilityToCharacter(formData: FormData) {
	const abilityId = Number(formData.get("id"));
	const characterId = Number(formData.get("characterId"));

	if (!abilityId || !characterId) {
		console.error("Missing required parameters");
		return;
	}

	try {
		await db.query("INSERT INTO CharacterAbilities (character_id, ability_id, activation_count) VALUES (?, ?, 0)", [
			characterId,
			abilityId,
		]);
		revalidatePath(`/character/${characterId}`);
	} catch (error) {
		console.error("Error adding ability to character:", error);
		return;
	}

	redirect(`/character/${characterId}`);
}

