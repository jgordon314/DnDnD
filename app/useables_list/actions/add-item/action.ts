"use server"

import { auth } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { redirect } from "next/navigation";

export async function addItemToUser(formData: FormData) {
    const session = await auth();

    if (!session) return;

    const itemId = formData.get("id")
    const characterId = formData.get("characterId")

    const [userCharacters] = await db.query(
        "SELECT id FROM Characters WHERE id = ? AND user_id = (SELECT id FROM Users WHERE username = ?)",
        [characterId, session.user.username]
    );

    if (!Array.isArray(userCharacters) || userCharacters.length === 0) return;

    await db.query(
        "INSERT INTO CharacterInventory (character_id, item_id, quantity, activation_count) VALUES (?, ?, 1, 0)",
        [characterId, itemId]
    );

    redirect(`/character/${characterId}`);
}
