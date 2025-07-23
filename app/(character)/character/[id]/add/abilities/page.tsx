import db from "@/app/lib/db";
import { CharacterAbility, Ability } from "@/app/lib/types";
import ListTable from "@/app/components/UsableList"
import { addAbilityToCharacter } from "./actions";

export default async function AbilityList({ params }: { params: Promise<{ id?: string }> }) {
	const {id} = await params;
	const characterId = id ? parseInt(id) : undefined;
	const fetchAbilitiesSQL = characterId
		? `
			SELECT a.* FROM Abilities a 
			LEFT JOIN CharacterAbilities ca ON a.id = ca.ability_id AND ca.character_id = ? 
			WHERE ca.character_id IS NULL
		`
		: `SELECT * FROM Abilities`;

	const [rows] = await db.query(fetchAbilitiesSQL, characterId ? [characterId] : []);

	// the ListTable needs something with id and i don't wanna fix it so we just make our own id
	const mappedRows = (rows as any[]).map((row) => ({
		...row,
		id: row.id,
	}));

	const columns = [
		{ header: "Name", accessor: "name" as keyof (Ability & { id: number }) },
		{ header: "Description", accessor: "description" as keyof (Ability & { id: number }) },
	];

	const actions = characterId
		? [
				{
					label: "Add to Character",
					actionUrl: "/useables_list/actions/add-ability",
					serverAction: addAbilityToCharacter,
				},
		  ]
		: [];

	return (
		<div className="flex flex-col gap-5">
			<h1 className="text-3xl">Add Abilities</h1>
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">Available Abilities</h1>
				{characterId && (
					<p className="mb-4">Click the "Add to Character" button to add an ability to your character.</p>
				)}
				<ListTable columns={columns} data={mappedRows} actions={actions} characterId={characterId} />
			</div>
		</div>
	);
}
