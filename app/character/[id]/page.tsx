import "../../temp.css";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import conn from "@/app/lib/db";
import { addSkillDeltas, skillLabelText } from "@/app/lib/utils";
import { Character, SkillDeltas } from "@/app/types";
import Link from "next/link";
import { SkillDeltasTable } from "./components/SkillDeltasTable";
import { CharacterInventoryTable } from "./components/CharacterInventoryTable";
import { CharacterAbilitiesTable } from "./components/CharacterAbilitiesTable";
import { CharacterSpellsTable } from "./components/CharacterSpellsTable";

async function fetchBaseSkillDeltas(characterId: number): Promise<SkillDeltas> {
	const fetchBaseSkillDeltasSQL = `
	SELECT sd.*
	FROM SkillDeltas sd, Characters c
	WHERE c.id = ? AND sd.id = c.base_stat_id
	`

	const [rows] = await conn.query(fetchBaseSkillDeltasSQL, [characterId])

	return addSkillDeltas(...(rows as SkillDeltas[]));
}

async function calculateCumulativeSkillDeltas(characterId: number): Promise<SkillDeltas> {
	const fetchSkillDeltasSQL = `
	(
		SELECT sd.*, 1 AS multiplier
		FROM SkillDeltas sd, Characters c
		WHERE c.id = ? AND sd.id = c.base_stat_id
	) UNION ALL (
		SELECT sd.*, csl.activations AS multiplier
		FROM SkillDeltas sd, Spells s, CharacterSpellList csl, Characters c
		WHERE c.id = ? AND s.id = csl.spell_id AND csl.character_id = c.id AND sd.id = s.skill_delta_id AND csl.activations > 0
	) UNION ALL (
		SELECT sd.*, ca.activation_count AS multiplier
		FROM SkillDeltas sd, Abilities a, CharacterAbilities ca, Characters c
		WHERE c.id = ? AND a.id = ca.ability_id AND ca.character_id = c.id AND sd.id = a.skill_delta_id AND ca.activation_count > 0
	) UNION ALL (
		SELECT sd.*, ci.activation_count AS multiplier
		FROM SkillDeltas sd, Abilities a, Items i, CharacterInventory ci, Characters c
		WHERE c.id = ? AND i.id = ci.item_id AND ci.character_id = c.id AND a.id = i.ability_id AND sd.id = a.skill_delta_id AND ci.activation_count > 0
	);
	`

	const [rows] = await conn.query(fetchSkillDeltasSQL, Array(4).fill(characterId))

	return addSkillDeltas(...(rows as SkillDeltas[]));
}


export default async function CharacterDetail({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const session = await auth();

	if (!session) {
		return (
			<>
				Not signed in
			</>
		)
	}

	const { id: paramCharacterId } = await params;
	const characterId = +paramCharacterId;

	const [characters] = await conn.query("SELECT * FROM Characters WHERE id = ?", [characterId]);
	const character = (characters as Character[])[0];

	const cumSkillDeltas = await calculateCumulativeSkillDeltas(characterId);
	const baseSkillDeltas = await fetchBaseSkillDeltas(characterId);

	

	return (

		<div className="paulward">
			<div>
				<h1><Link href="/character_list">Go back</Link></h1>
				<h1>Signed in as: {session.user.name}</h1>
				<h1>{character.name}</h1>
				<p>{character.description}</p>
			</div>
			<br />
			<div>
				<SkillDeltasTable characterId={characterId} cumSkillDeltas={cumSkillDeltas} baseSkillDeltas={baseSkillDeltas} />
			</div>
			<br />
			<div>
				<CharacterInventoryTable characterId={characterId} />
			</div>
			<br />
			<div>
				<CharacterAbilitiesTable characterId={characterId} />
			</div>
			<br />
			<div>
				<CharacterSpellsTable characterId={characterId} />
			</div>
		</div>
	);
}
