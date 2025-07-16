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
