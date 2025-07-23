"use client";
import React, { useState } from "react";
import { AbilityType, SkillDeltas } from "../../../../lib/types";
import { zeroSkillDeltas } from "../../../../lib/models/skillDeltas/utils";
import SkillDeltasForm from "@/app/components/SkillDeltasForm";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/app/components/ui/select";

export function NewAbilityForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<AbilityType>("action");
    const [skillDeltas, setSkillDeltas] = useState<SkillDeltas>(zeroSkillDeltas());

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsError(false);

        // Ensure type is one of the valid enum values
        const validType = ["non-action", "action", "bonus-action", "reaction", "free-action"].includes(type)
            ? type
            : "action";

        const formData = {
            name,
            description,
            type: validType,
            ...skillDeltas, // Always include skill deltas
        };

        try {
            const response = await fetch("/api/abilities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create ability");
            }

            router.push("/abilities");
        } catch (error) {
            console.error("Error creating ability:", error);
            setErrorText(error instanceof Error ? error.message : String(error))
            setIsError(true);
        }
    }

    return (
        <>
            <h1 className="text-3xl mb-10">New Ability</h1>
            <form
                onSubmit={handleSubmit}
				className="form scrollable-form flex flex-col gap-5"
            >
                {isError &&
                    <Alert variant="destructive">
                        <AlertTitle>Failed to create item</AlertTitle>
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
                        placeholder="Describe the ability's effects, range, duration, cooldown, prerequisites, etc."
                        rows={6}
                        required
                    />
                </div>

                <div className="grid w-full gap-3">
                    <Label htmlFor="type">Type</Label>
                    <Select
                        value={type}
                        onValueChange={(value) => setType(value as AbilityType)}
                    >
                        <SelectTrigger className="min-w-20">
                            <SelectValue placeholder="Type of the ability..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Ability Types</SelectLabel>
                                <SelectItem value="non-action">Non-Action</SelectItem>
                                <SelectItem value="action">Action</SelectItem>
                                <SelectItem value="bonus-action">Bonus Action</SelectItem>
                                <SelectItem value="reaction">Reaction</SelectItem>
                                <SelectItem value="free-action">Free Action</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <SkillDeltasForm title="Skill Modifiers" skillDeltas={skillDeltas} onSkillDeltasChange={setSkillDeltas} />

                <div className="flex flex-wrap items-center gap-2 md:flex-row">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2Icon className="animate-spin" />}
                        Create Ability
                    </Button>
                </div>
            </form>
        </>
    );
}
