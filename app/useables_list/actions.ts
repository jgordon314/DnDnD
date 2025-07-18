"use server";

import { revalidatePath } from "next/cache";
import db from "../lib/db";
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
		redirect(`/character/${characterId}`);
	} catch (error) {
		console.error("Error adding ability to character:", error);
		return { success: false, error: "Failed to add ability to character" };
	}
}

export async function addItemToCharacter(formData: FormData) {
	const itemId = Number(formData.get("id"));
	const characterId = Number(formData.get("characterId"));

	if (!itemId || !characterId) {
		console.error("Missing required parameters");
		return;
	}

	try {
		await db.query(
			"INSERT INTO CharacterInventory (character_id, item_id, quantity, activation_count) VALUES (?, ?, 1, 0)",
			[characterId, itemId]
		);
		revalidatePath(`/character/${characterId}`);
		redirect(`/character/${characterId}`);
	} catch (error) {
		console.error("Error adding item to character:", error);
		return { success: false, error: "Failed to add item to character" };
	}
}

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
		redirect(`/character/${characterId}`);
	} catch (error) {
		console.error("Error adding spell to character:", error);
		return { success: false, error: "Failed to add spell to character" };
	}
}
