import { SkillDeltas, SkillDeltasWithMultiplier } from "../types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function skillLabelText(skillName: string): string {
    if (skillName === "sleight_of_hand") {
        return "Sleight of hand";
    }

    return skillName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function addSkillDeltas(...skillDeltaArgs: Partial<SkillDeltasWithMultiplier>[]) {
    let result: SkillDeltas = {
        armor_class: 0,
        current_health: 0,
        max_health: 0,
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        constitution: 0,
        athletics: 0,
        acrobatics: 0,
        sleight_of_hand: 0,
        stealth: 0,
        arcana: 0,
        history: 0,
        investigation: 0,
        nature: 0,
        religion: 0,
        animal_handling: 0,
        insight: 0,
        medicine: 0,
        perception: 0,
        survival: 0,
        deception: 0,
        intimidation: 0,
        performance: 0,
        persuasion: 0,
    }

    for (const skillDeltas of skillDeltaArgs) {
		for (const skillName of Object.keys(result) as Array<keyof SkillDeltas>) {
            result[skillName] += (skillDeltas[skillName] ?? 0) * (skillDeltas.multiplier ?? 1)
		}
	}

    return result;
}

export function zeroSkillDeltas(): SkillDeltas {
    return addSkillDeltas()
}
