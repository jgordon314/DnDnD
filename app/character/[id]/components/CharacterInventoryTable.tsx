import conn from "@/app/lib/db";
import { CharacterItem, Item } from "@/app/types";

export async function CharacterInventoryTable({
    characterId
}: {
    characterId: number;
}) {

    const fetchCharacterInventorySQL = `
    SELECT * From Items i, CharacterInventory ci
    WHERE i.id = ci.item_id AND ci.character_id = ?
    `

    const [rows] = await conn.query(fetchCharacterInventorySQL, [characterId])

    return (
        <table>
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Activation Count</th>
                    <th>Item Count</th>
                </tr>
            </thead>
            <tbody>
                {(rows as (Item & CharacterItem)[]).map(row => <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.activation_count}</td>
                    <td>{row.quantity}</td>
                </tr>)}
            </tbody>
        </table>
    )
}
