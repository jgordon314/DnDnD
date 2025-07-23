import conn from "../../db";
import { SkillDeltas } from "../../types";
import { addSkillDeltas } from "./utils";

export async function fetchBaseSkillDeltas(characterId: number): Promise<SkillDeltas> {
	const fetchBaseSkillDeltasSQL = `
	SELECT sd.*
	FROM SkillDeltas sd, Characters c
	WHERE c.id = ? AND sd.id = c.base_stat_id
	`;

	const [rows] = await conn.query(fetchBaseSkillDeltasSQL, [characterId]);

	return addSkillDeltas(...(rows as SkillDeltas[]));
}

export async function calculateCumulativeSkillDeltas(characterId: number): Promise<SkillDeltas> {
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
	`;

	const [rows] = await conn.query(fetchSkillDeltasSQL, Array(4).fill(characterId));

	return addSkillDeltas(...(rows as SkillDeltas[]));
}
