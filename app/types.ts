export interface Character {
	id: number;
	name: string;
	description: string;
	user_id: number;
	base_stat_id: number;
}

export interface SkillDeltas {
	armor_class: number;
	current_health: number;
	max_health: number;
	strength: number;
	dexterity: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
	constitution: number;
	athletics: number;
	acrobatics: number;
	sleight_of_hand: number;
	stealth: number;
	arcana: number;
	history: number;
	investigation: number;
	nature: number;
	religion: number;
	animal_handling: number;
	insight: number;
	medicine: number;
	perception: number;
	survival: number;
	deception: number;
	intimidation: number;
	performance: number;
	persuasion: number;
}

export interface SkillDeltasWithMultiplier extends SkillDeltas {
	multiplier?: number;
}

export type AbilityType = "non-action" | "action" | "bonus-action" | "reaction" | "free-action";

export interface Ability {
	aid: number;
	name: string;
	description: string;
	skill_delta_id: string;
	type: AbilityType;
}

export interface CharacterAbility {
	character_id: number;
	ability_id: number;
	activation_count: number;
	max_uses: number | null;
	available_uses: number | null;
}

export interface Spell {
	id: number;
	name: string;
	level: number;
	description: string;
	duration: number;
	skill_delta_id: number;
	casting_time: string;
	spell_range: string;
	components: string;
}

export interface CharacterSpell {
	character_id: number;
	spell_id: number;
	activations: number;
}

export interface Item {
	id: number;
	name: string;
	description: string;
	ability_id: number;
}

export interface CharacterItem {
	character_id: number;
	item_id: number;
	quantity: number;
	activation_count: number;
}
