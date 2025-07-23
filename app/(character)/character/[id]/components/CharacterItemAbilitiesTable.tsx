import conn from "@/app/lib/db";
import { CharacterAbility, Ability } from "@/app/lib/types";
import { CharacterItemAbilitiesTableClient } from "./CharacterItemAbilitiesTableClient";

export async function CharacterItemAbilitiesTable({
    characterId
}: {
    characterId: number;
}) {
    const fetchItemCharacterAbilitiesSQL = `
    SELECT a.id AS id, a.name AS name, ci.activation_count AS activation_count
    FROM Abilities a, Items i, CharacterInventory ci
    WHERE i.id = ci.item_id AND i.ability_id = a.id AND ci.activation_count >= 0
    AND ci.character_id = ?
    `;

    const [rows] = await conn.query(fetchItemCharacterAbilitiesSQL, [characterId]);

    return (
        <CharacterItemAbilitiesTableClient
            rows={rows as (Ability & CharacterAbility)[]}
            characterId={characterId}
        />
    );
}
