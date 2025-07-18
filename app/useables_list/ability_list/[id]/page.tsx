import db from "@/app/lib/db";
import { CharacterAbility, Ability } from "@/app/types";
import ListTable from "../../components/UsableList";
import { addAbilityToCharacter } from "../../actions";

export default async function AbilityList({ params }: { params: { id?: string } }) {
	const characterId = params.id ? parseInt(params.id) : undefined;
	const fetchAbilitiesSQL = characterId
		? `
			SELECT a.* FROM Abilities a 
			LEFT JOIN CharacterAbilities ca ON a.id = ca.ability_id AND ca.character_id = ? 
			WHERE ca.character_id IS NULL
		`
		: `SELECT * FROM Abilities`;

	const [rows] = await db.query(fetchAbilitiesSQL, characterId ? [characterId] : []);

	const columns = [
		{ header: "Name", accessor: "name" as keyof Ability },
		{ header: "Description", accessor: "description" as keyof Ability },
	];

	const actions = characterId
		? [
				{
					label: "Add to Character",
					actionUrl: "/useables_list/actions/add-ability",
				},
		  ]
		: [];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Available Abilities</h1>
			{characterId && (
				<p className="mb-4">Click the "Add to Character" button to add an ability to your character.</p>
			)}
			<ListTable columns={columns} data={rows as Ability[]} actions={actions} characterId={characterId} />
		</div>
	);
}
