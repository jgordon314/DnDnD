"use client";

import { ID, type Character } from "../../../lib/types";
import { useState } from "react";
import { deleteCharacterByCharacterId, getCharactersForUser } from "../../../lib/models/characters";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CharacterList({ characters: givenCharacters }: { characters: Character[] }) {
  const [characters, setCharacters] = useState(givenCharacters);
  const router = useRouter();

  async function deleteCharacter(characterId: ID) {
    await deleteCharacterByCharacterId(characterId);
    setCharacters(characters.filter(c => c.id != characterId))
    router.refresh();
  }

  return (
    <div>
      {characters.map(character =>
        <Card className="mb-5 flex flex-row place-content-between items-center pr-7" key={character.id}>
          <Link className="grow" href={`/character/${character.id}`} >
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>{character.description}</CardDescription>
            </CardHeader>
          </Link>
          <X className="cursor-pointer" onClick={() => deleteCharacter(character.id)} />
        </Card>
      )}
    </div>
  )
}

