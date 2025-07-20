import db from "@/app/lib/db";
import ListTable from "../../components/UsableList";
import { Spell } from "@/app/types";
import { addSpellToCharacter } from "../../actions";

export default async function SpellList({ params }: { params: { id?: string } }) {
	const characterId = params.id ? parseInt(params.id) : undefined;

	// If no character ID is provided, show all spells
	const fetchSpellsSQL = characterId
		? `
			SELECT s.* FROM Spells s 
			LEFT JOIN CharacterSpellList csl ON s.id = csl.spell_id AND csl.character_id = ? 
			WHERE csl.character_id IS NULL
		`
		: `SELECT * FROM Spells`;

	const [rows] = await db.query(fetchSpellsSQL, characterId ? [characterId] : []);

	const columns = [
		{ header: "Name", accessor: "name" as keyof Spell },
		{ header: "Level", accessor: "level" as keyof Spell },
		{ header: "Casting Time", accessor: "casting_time" as keyof Spell },
		{ header: "Duration", accessor: "duration" as keyof Spell },
		{ header: "Description", accessor: "description" as keyof Spell },
	];

	const actions = characterId
		? [
				{
					label: "Add to Character",
					actionUrl: "/useables_list/actions/add-spell",
				},
		  ]
		: [];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Available Spells</h1>
			{characterId && (
				<p className="mb-4">
					Click the "Add to Character" button to add a spell to your character's spellbook.
				</p>
			)}
			<ListTable columns={columns} data={rows as Spell[]} actions={actions} characterId={characterId} />
		</div>
	);
}
