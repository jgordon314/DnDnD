import { auth } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { redirect } from "next/navigation";

export async function addAbilityToUser(formData: FormData) {
    const session = await auth();
    if (!session) return;

    const abilityId = Number(formData.get("id"));
    const characterId = Number(formData.get("characterId"));

    if (!abilityId || !characterId) return;

    const [userCharacters] = await db.query(
        "SELECT id FROM Characters WHERE id = ? AND user_id = (SELECT id FROM Users WHERE username = ?)",
        [characterId, session.user.username]
    );

    if (!Array.isArray(userCharacters) || userCharacters.length === 0) return;

    await db.query("INSERT INTO CharacterAbilities (character_id, ability_id, activation_count) VALUES (?, ?, 0)", [
        characterId,
        abilityId,
    ]);

    return redirect(`/character/${characterId}`)
}
