import conn from "@/app/lib/db";
import { CharacterItem, Item } from "@/app/lib/types";
import { CharacterInventoryTableClient } from "./CharacterInventoryTableClient";

export async function CharacterInventoryTable({ characterId }: { characterId: number }) {
	const fetchCharacterInventorySQL = `
    SELECT * From Items i, CharacterInventory ci
    WHERE i.id = ci.item_id AND ci.character_id = ?
    `;

	const [rows] = await conn.query(fetchCharacterInventorySQL, [characterId]);

	return <CharacterInventoryTableClient rows={rows as (Item & CharacterItem)[]} characterId={characterId} />;
}
