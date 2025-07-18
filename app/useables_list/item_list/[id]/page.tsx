import db from "@/app/lib/db";
import { Item } from "@/app/types";
import ListTable from "../../components/UsableList";
import { addItemToCharacter } from "../../actions";

export default async function ItemList({ params }: { params: { id?: string } }) {
	const resolvedParams = await params;
	const characterId = resolvedParams.id ? parseInt(await resolvedParams.id) : undefined;

	// If no character ID is provided, show all items
	const fetchItemsSQL = characterId
		? `
			SELECT i.* FROM Items i 
			LEFT JOIN CharacterInventory ci ON i.id = ci.item_id AND ci.character_id = ? 
			WHERE ci.character_id IS NULL
		`
		: `SELECT * FROM Items`;

	const [rows] = await db.query(fetchItemsSQL, characterId ? [characterId] : []);

	// convert json description into text version
	const transformedRows = (rows as Item[]).map((item) => {
		try {
			const formattedDescription = Object.entries(item.description)
				.map(([key, value]) => `${key}: ${value.split("'").join("")}`)
				.join("\n");

			return {
				...item,
				description: formattedDescription,
			};
		} catch (error) {
			console.log("error", error);
			return item;
		}
	});

	console.log(transformedRows);

	const columns = [
		{ header: "Name", accessor: "name" as keyof Item },
		{ header: "Description", accessor: "description" as keyof Item },
	];

	const actions = characterId
		? [
				{
					label: "Add to Character",
					actionUrl: "/useables_list/actions/add-item",
				},
		  ]
		: [];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Available Items</h1>
			{characterId && (
				<p className="mb-4">
					Click the "Add to Character" button to add an item to your character's inventory.
				</p>
			)}
			<ListTable columns={columns} data={transformedRows as Item[]} actions={actions} characterId={characterId} />
		</div>
	);
}
