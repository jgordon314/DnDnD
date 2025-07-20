import conn from "@/app/lib/db";
import { CharacterAbility, Ability } from "@/app/types";
import { CharacterAbilitiesTableClient } from "./CharacterAbilitiesTableClient";

export async function CharacterAbilitiesTable({ characterId }: { characterId: number }) {
	const fetchCharacterAbilitiesSQL = `
    SELECT a.id, a.name, a.description, a.skill_delta_id, a.type,
           ca.character_id, ca.ability_id, ca.activation_count, ca.max_uses, ca.available_uses
    FROM Abilities a, CharacterAbilities ca
    WHERE a.id = ca.ability_id AND ca.character_id = ?
    `;

	const [rows] = await conn.query(fetchCharacterAbilitiesSQL, [characterId]);

	return <CharacterAbilitiesTableClient rows={rows as (Ability & CharacterAbility)[]} characterId={characterId} />;
}
