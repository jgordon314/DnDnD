import conn from "@/app/lib/db";
import { CharacterSpell, Spell } from "@/app/lib/types";
import { CharacterSpellsTableClient } from "./CharacterSpellsTableClient";

export async function CharacterSpellsTable({ characterId }: { characterId: number }) {
	const fetchCharacterSpellsSQL = `
    SELECT * From Spells s, CharacterSpellList csi
    WHERE s.id = csi.spell_id AND csi.character_id = ?
    `;
	const [rows] = await conn.query(fetchCharacterSpellsSQL, [characterId]);

	return <CharacterSpellsTableClient rows={rows as (Spell & CharacterSpell)[]} characterId={characterId} />;
}
