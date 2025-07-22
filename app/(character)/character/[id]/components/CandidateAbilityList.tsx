import db from "@/app/lib/db";
import { CharacterAbility, Ability, ID } from "@/app/lib/types";
import ListTable from "@/app/useables_list/components/UsableList";
import { addAbilityToCharacter } from "@/app/useables_list/actions";

export async function CandidateAbilityList({ characterId }: { characterId: ID }) {
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
		<div className="pr-2">
			<ListTable columns={columns} data={mappedRows} actions={actions} characterId={characterId} />
		</div>
	);
}
