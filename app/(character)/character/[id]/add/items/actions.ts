"use server";

import db from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
	} catch (error) {
		console.error("Error adding item to character:", error);
		return;
	}

	redirect(`/character/${characterId}`);
}

