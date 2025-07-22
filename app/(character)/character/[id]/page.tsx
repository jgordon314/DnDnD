import { auth } from "@/app/api/auth/[...nextauth]/route";
import conn from "@/app/lib/db";
import { calculateCumulativeSkillDeltas, fetchBaseSkillDeltas } from "@/app/lib/models/skillDeltas/query";
import { Character } from "@/app/lib/types";
import Link from "next/link";
import { SkillDeltasTable } from "./components/SkillDeltasTable";
import { CharacterInventoryTable } from "./components/CharacterInventoryTable";
import { CharacterAbilitiesTable } from "./components/CharacterAbilitiesTable";
import { CharacterSpellsTable } from "./components/CharacterSpellsTable";
import { CharacterItemAbilitiesTable } from "./components/CharacterItemAbilitiesTable";
import { LongRestButton } from "./components/LongRestButton";
import { redirect } from "next/navigation";



export default async function CharacterDetail({ params }: { params: { id: string } }) {
	const session = await auth();

	const { id: paramCharacterId } = params;
	const characterId = +paramCharacterId;

	if (!session) {
		redirect(`/auth/login?next=/character/${characterId}`)
	}

	const [characters] = await conn.query("SELECT * FROM Characters WHERE id = ?", [characterId]);
	const character = (characters as Character[])[0];

	const cumSkillDeltas = await calculateCumulativeSkillDeltas(characterId);
	const baseSkillDeltas = await fetchBaseSkillDeltas(characterId);

	return (
		<div className="flex flex-col gap-5">
			<h1 className="text-3xl">{character.name}</h1>
			<p className="">{character.description}</p>
			<div>
				<SkillDeltasTable
					characterId={characterId}
					cumSkillDeltas={cumSkillDeltas}
					baseSkillDeltas={baseSkillDeltas}
				/>
			</div>
			<br />
			<div>
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-xl font-bold">Inventory</h2>
					<Link
						href={`/useables_list/item_list/${characterId}`}
						className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm">
						Add Items
					</Link>
				</div>
				<CharacterInventoryTable characterId={characterId} />
			</div>
			<br />
			<div>
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-xl font-bold">Abilities</h2>
					<Link
						href={`/useables_list/ability_list/${characterId}`}
						className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm">
						Add Abilities
					</Link>
				</div>
				<CharacterAbilitiesTable characterId={characterId} />
			</div>
			<br />
			<div>
				<CharacterItemAbilitiesTable characterId={characterId} />
			</div>
			<br />
			<div>
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-xl font-bold">Spells</h2>
					<Link
						href={`/useables_list/spell_list/${characterId}`}
						className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm">
						Add Spells
					</Link>
				</div>
				<CharacterSpellsTable characterId={characterId} />
			</div>
			<br />
			<div>
				<LongRestButton characterId={characterId} />
			</div>
		</div>
	);
}
