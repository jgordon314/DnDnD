import conn from "@/app/lib/db";
import { CharacterAbility, Ability } from "@/app/types";
import { CharacterAbilitiesTableClient } from "./CharacterAbilitiesTableClient";

export async function CharacterAbilitiesTable({ characterId }: { characterId: number }) {
	const fetchCharacterAbilitiesSQL = `
    SELECT * From Abilities a, CharacterAbilities ca
    WHERE a.id = ca.ability_id AND ca.character_id = ?
    `;

	const [rows] = await conn.query(fetchCharacterAbilitiesSQL, [characterId]);

	return <CharacterAbilitiesTableClient rows={rows as (Ability & CharacterAbility)[]} characterId={characterId} />;
}
