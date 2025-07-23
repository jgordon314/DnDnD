"use client";
import React, { useState } from "react";
import { SkillDeltas } from "../../../../lib/types";
import { zeroSkillDeltas } from "../../../../lib/models/skillDeltas/utils";
import SkillDeltasForm from "@/app/components/SkillDeltasForm";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Textarea } from "@/app/components/ui/textarea";

interface Props {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function NewSpellForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState(0);
    const [duration, setDuration] = useState(0);
    const [castingTime, setCastingTime] = useState("");
    const [spellRange, setSpellRange] = useState("");
    const [components, setComponents] = useState("");
    const [skillDeltas, setSkillDeltas] = useState<SkillDeltas>(zeroSkillDeltas());

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsError(false);

        const formData = {
            name,
            description,
            level,
            duration,
            casting_time: castingTime,
            spell_range: spellRange,
            components,
            ...skillDeltas,
        };

        try {
            const response = await fetch("/api/spells", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create spell");
            }

            router.push("/spells");
        } catch (error) {
            setIsLoading(false);
            setErrorText(error instanceof Error ? error.message : String(error));
            setIsError(true);
        }
    };

    return (
        <>
            <h1 className="text-3xl mb-10">New Spells</h1>
            <form
                onSubmit={handleSubmit}
                className="form scrollable-form flex flex-col gap-5"
            >
                {isError &&
                    <Alert variant="destructive">
                        <AlertTitle>Failed to create spell</AlertTitle>
                        <AlertDescription>
                            {errorText}
                        </AlertDescription>
                    </Alert>
                }

                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="grid w-full gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what the spell does..."
                        rows={3}
                        required
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="grid items-center gap-3 flex-1">
                        <Label htmlFor="level">Level</Label>
                        <Input
                            type="number"
                            min={0}
                            max={9}
                            value={level}
                            onChange={(e) => setLevel(parseInt(e.target.value || "0"))}
                            className=""
                            required
                            id="level"
                        />
                    </div>
                    <div className="grid items-center gap-3 flex-1">
                        <Label htmlFor="duration">Duration (seconds)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value || "0"))}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-grow items-center gap-2">
                    <div className="grid items-center gap-3 flex-1">
                        <Label htmlFor="casting-time">Casting Time</Label>
                        <Input
                            type="text"
                            value={castingTime}
                            onChange={(e) => setCastingTime(e.target.value)}
                            placeholder="e.g., 1 action, 1 minute"
                            required
                            id="level"
                        />
                    </div>
                    <div className="grid items-center gap-3 flex-1">
                        <Label htmlFor="range">Range</Label>
                        <Input
                            type="text"
                            value={spellRange}
                            onChange={(e) => setSpellRange(e.target.value)}
                            placeholder="e.g., 30 feet, Self"
                            required
                        />
                    </div>
                </div>

                <div className="grid items-center gap-3">
                    <Label htmlFor="components">Components</Label>
                    <Input
                        type="text"
                        value={components}
                        onChange={(e) => setComponents(e.target.value)}
                        placeholder="e.g., V, S, M"
                        required
                    />
                </div>

                <SkillDeltasForm title="Skill Modifiers" skillDeltas={skillDeltas} onSkillDeltasChange={setSkillDeltas} />

                <div className="flex flex-wrap items-center gap-2 md:flex-row">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2Icon className="animate-spin" />}
                        Create Spell
                    </Button>
                </div>
            </form>
        </>
    );
}
