'use client'

import { skillLabelText } from "@/app/lib/utils";
import { SkillDeltas } from "@/app/lib/types";
import { useState } from "react";
import { updateCharacterBaseSkillDeltas } from "../actions";

export function SkillDeltasTable({
    characterId,
    cumSkillDeltas,
    baseSkillDeltas
}: {
    characterId: number,
    cumSkillDeltas: SkillDeltas,
    baseSkillDeltas: SkillDeltas,
}) {
    const [cumSkillDeltasState, setCumSkillDeltasState] = useState(cumSkillDeltas);
    const [baseSkillDeltasState, setBaseSkillDeltasState] = useState(baseSkillDeltas);

    async function updateBaseSkillDeltas(skillDeltasKey: keyof SkillDeltas, value: number) {
        setCumSkillDeltasState(
            {
                ...cumSkillDeltasState,
                [skillDeltasKey]: cumSkillDeltasState[skillDeltasKey] - baseSkillDeltasState[skillDeltasKey] + value
            }
        )

        const newBaseSkillDeltasState = {
            ...baseSkillDeltasState,
            [skillDeltasKey]: value
        }

        setBaseSkillDeltasState(newBaseSkillDeltasState)
        await updateCharacterBaseSkillDeltas(characterId, newBaseSkillDeltasState)
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Skill Name</th>
                    <th>Cumulative Points</th>
                    <th>Base Character Points</th>
                    <th>Update</th>
                </tr>
            </thead>
            <tbody>
                {(Object.keys(cumSkillDeltas) as Array<keyof SkillDeltas>).map(skillDeltasKey =>
                    <tr key={skillDeltasKey}>
                        <td>{skillLabelText(skillDeltasKey)}</td>
                        <td>{cumSkillDeltasState[skillDeltasKey]}</td>
                        <td>{baseSkillDeltasState[skillDeltasKey]}</td>
                        <td>
                            <button onClick={() => updateBaseSkillDeltas(skillDeltasKey, baseSkillDeltasState[skillDeltasKey] - 1)}><a>-</a></button>
                            <button onClick={() => updateBaseSkillDeltas(skillDeltasKey, baseSkillDeltasState[skillDeltasKey] + 1)}><a>+</a></button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
