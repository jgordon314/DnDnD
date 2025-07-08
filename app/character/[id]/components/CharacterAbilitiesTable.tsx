import conn from "@/app/lib/db";
import { CharacterAbility, Ability } from "@/app/types";

export async function CharacterAbilitiesTable({
    characterId
}: {
    characterId: number;
}) {

    const fetchCharacterAbilitiesSQL = `
    SELECT * From Abilities a, CharacterAbilities ca
    WHERE a.id = ca.ability_id AND ca.character_id = ?
    `

    const [rows] = await conn.query(fetchCharacterAbilitiesSQL, [characterId])

    return (
        <table>
            <thead>
                <tr>
                    <th>Ability Name</th>
                    <th>Activation Count</th>
                </tr>
            </thead>
            <tbody>
                {(rows as (Ability & CharacterAbility)[]).map(row => <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.activation_count}</td>
                </tr>)}
            </tbody>
        </table>
    )
}
