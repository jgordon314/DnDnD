import conn from "@/app/lib/db";
import { CharacterSpell, Spell } from "@/app/types";


export async function CharacterSpellsTable({
    characterId
}: {
    characterId: number;
}) {

    const fetchCharacterSpellsSQL = `
    SELECT * From Spells s, CharacterSpellList csi
    WHERE s.id = csi.spell_id AND csi.character_id = ?
    `
    const [rows] = await conn.query(fetchCharacterSpellsSQL, [characterId])

    console.log(rows)

    return (
        <table>
            <thead>
                <tr>
                    <th>Spell Name</th>
                    <th>Level</th>
                    <th>Casting Time</th>
                    <th>Duration</th>
                    <th>Activation Count</th>
                </tr>
            </thead>
            <tbody>
                {(rows as (Spell & CharacterSpell)[]).map(row => <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.level}</td>
                    <td>{row.casting_time}</td>
                    <td>{row.duration}</td>
                    <td>{row.activations}</td>
                </tr>)}
            </tbody>
        </table>
    )
}
