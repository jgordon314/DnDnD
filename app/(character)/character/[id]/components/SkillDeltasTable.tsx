'use client'

import { skillLabelText } from "@/app/lib/utils";
import { SkillDeltas } from "@/app/lib/types";
import { useState } from "react";
import { updateCharacterBaseSkillDeltas } from "../actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Cumulative Points</TableHead>
                    <TableHead>Base Character Points</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {(Object.keys(cumSkillDeltas) as Array<keyof SkillDeltas>).map(skillDeltasKey =>
                    <TableRow key={skillDeltasKey}>
                        <TableCell>{skillLabelText(skillDeltasKey)}</TableCell>
                        <TableCell>{cumSkillDeltasState[skillDeltasKey]}</TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                value={baseSkillDeltasState[skillDeltasKey]}
                                onChange={(e) => {
                                    const val = Number(e.target.value)
                                    val && updateBaseSkillDeltas(skillDeltasKey, val)
                                }}
                                required
                                className="max-w-20"
                            />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
