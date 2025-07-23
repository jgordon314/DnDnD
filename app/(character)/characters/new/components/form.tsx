"use client";

import SkillDeltasForm from "@/app/components/SkillDeltasForm";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { zeroSkillDeltas } from "@/app/lib/models/skillDeltas/utils";
import { SkillDeltas } from "@/app/lib/types";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function NewCharacterForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [health, setHealth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [skillDeltas, setSkillDeltas] = useState<SkillDeltas>(zeroSkillDeltas());

  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const player_id: number | undefined = session?.user?.id ? Number(session.user.id) : undefined;

  async function createCharacter(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    console.log("Submitting name:", name, skillDeltas);
    if (!name.trim()) {
      console.warn("Name cannot be empty");
      return;
    }
    if (!player_id) {
      console.warn("No player_id found in session");
      return;
    }
    const payload = { name, ...skillDeltas, current_health: health, max_health: health, player_id, description };
    const res = await fetch("/api/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/character/${data.characterId}`);
      router.refresh();
    } else {
      setIsLoading(false);
      const errorText = await res.text();
      setIsError(true);
      setErrorText(errorText);
    }
  }


  console.log(errorText)

  return (
    <>
      <h1 className="text-3xl mb-10">New Character</h1>
      <form
        onSubmit={createCharacter}
        className="flex flex-col gap-5"
      >
        {isError &&
          <Alert variant="destructive">
            <AlertTitle>Failed to create character</AlertTitle>
            <AlertDescription>
              {errorText}
            </AlertDescription>
          </Alert>
        }
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Zurg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="grid w-full gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Your character description."
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <SkillDeltasForm
          skillDeltas={skillDeltas}
          health={health}
          onSkillDeltasChange={setSkillDeltas}
          onHealthChange={setHealth}
        />
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2Icon className="animate-spin" />}
            Add Character
          </Button>
        </div>
      </form>
    </>
  )
}
