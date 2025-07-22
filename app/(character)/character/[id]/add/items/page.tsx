import db from "@/app/lib/db";
import { Item } from "@/app/lib/types";
import ListTable from "@/app/components/UsableList"
import { addItemToCharacter } from "./actions";

export default async function ItemList({ params }: { params: Promise<{ id?: string }> }) {
	const {id} = await params;
	const characterId = id ? parseInt(id) : undefined;

	// If no character ID is provided, show all items
	const fetchItemsSQL = characterId
		? `
			SELECT i.* FROM Items i 
			LEFT JOIN CharacterInventory ci ON i.id = ci.item_id AND ci.character_id = ? 
			WHERE ci.character_id IS NULL
		`
		: `SELECT * FROM Items`;

	const [rows] = await db.query(fetchItemsSQL, characterId ? [characterId] : []);
	const items = rows as Item[];

	const columns = [
		{ header: "Name", accessor: "name" as keyof Item },
		{ header: "Description", accessor: "description" as keyof Item },
	];

	const actions = characterId
		? [
				{
					label: "Add to Character",
					actionUrl: "/useables_list/actions/add-item",
					serverAction: addItemToCharacter,
				},
		  ]
		: [];

	return (
		<div className="flex flex-col gap-5">
			<h1 className="text-3xl">Add Items</h1>
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">Available Items</h1>
				{characterId && (
					<p className="mb-4">
						Click the "Add to Character" button to add an item to your character's inventory.
					</p>
				)}
				<ListTable<Item> columns={columns} data={items} actions={actions} characterId={characterId} />
			</div>
		</div>
	);
}
