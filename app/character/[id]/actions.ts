'use server'

import conn from "@/app/lib/db";
import { SkillDeltas } from "@/app/types";

export async function updateCharacterBaseSkillDeltas(characterId: number, newSkillDeltas: SkillDeltas) {
    // TODO @HillcrestEnigma: Update this server action to take Partial<SkillDeltas>

    const updateCharacterBaseSkillDeltasSQL = `
    UPDATE SkillDeltas
    SET
    armor_class = ?,
    current_health = ?,
    max_health = ?,
    strength = ?,
    dexterity = ?,
    intelligence = ?,
    wisdom = ?,
    charisma = ?,
    constitution = ?,
    athletics = ?,
    acrobatics = ?,
    sleight_of_hand = ?,
    stealth = ?,
    arcana = ?,
    history = ?,
    investigation = ?,
    nature = ?,
    religion = ?,
    animal_handling = ?,
    insight = ?,
    medicine = ?,
    perception = ?,
    survival = ?,
    deception = ?,
    intimidation = ?,
    performance = ?,
    persuasion = ?
    WHERE id = (SELECT base_stat_id FROM Characters WHERE id = ?);
    `

    const skillDeltaKeys: Array<keyof SkillDeltas> = [
        'armor_class',
        'current_health',
        'max_health',
        'strength',
        'dexterity',
        'intelligence',
        'wisdom',
        'charisma',
        'constitution',
        'athletics',
        'acrobatics',
        'sleight_of_hand',
        'stealth',
        'arcana',
        'history',
        'investigation',
        'nature',
        'religion',
        'animal_handling',
        'insight',
        'medicine',
        'perception',
        'survival',
        'deception',
        'intimidation',
        'performance',
        'persuasion',
    ]

    await conn.query(updateCharacterBaseSkillDeltasSQL, [
        ...skillDeltaKeys.map(skillDeltaKey => newSkillDeltas[skillDeltaKey]),
        characterId,
    ])
}
