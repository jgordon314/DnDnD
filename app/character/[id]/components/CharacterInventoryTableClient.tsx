"use client";
import { useState } from "react";
import { CharacterItem, Item } from "@/app/types";

interface Props {
	rows: (Item & CharacterItem)[];
	characterId: number;
}

export function CharacterInventoryTableClient({ rows: initialRows, characterId }: Props) {
	const [rows, setRows] = useState<(Item & CharacterItem)[]>(initialRows);
	const [isPending, setPending] = useState<number | null>(null);

	async function handleEquip(itemId: number) {
		setPending(itemId);
		try {
			const response = await fetch("/api/equip", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ characterId, itemId }),
			});

			if (response.ok) {
				setRows(
					rows.map((row) => {
						if (row.id === itemId) {
							return {
								...row,
								activation_count: 0, // Setting to 0 when equipped (not -1)
							};
						}
						return row;
					})
				);
			} else {
				console.error("Failed to equip item:", await response.text());
			}
		} catch (error) {
			console.error("Error equipping item:", error);
		} finally {
			setPending(null);
		}
	}

async function handleUnequip(itemId: number) {
	setPending(itemId);
	try {
		const response = await fetch("/api/unequip", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ characterId, itemId }),
		});

		if (response.ok) {
			// Force a full page reload to refresh all data
			window.location.reload();
		} else {
			console.error("Failed to unequip item:", await response.text());
		}
	} catch (error) {
		console.error("Error unequipping item:", error);
	} finally {
		setPending(null);
	}
}

	return (
		<table>
			<thead>
				<tr>
					<th>Item Name</th>
					<th>Item Count</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.id}>
						<td>{row.name}</td>
						<td>{row.quantity}</td>
						<td>
							{row.activation_count === -1 ? (
								<button
									style={{
										padding: "6px 16px",
										borderRadius: "6px",
										background: "#0070f3",
										color: "#fff",
										border: "none",
										cursor: "pointer",
									}}
									disabled={isPending === row.id}
									onClick={() => handleEquip(row.id)}>
									Equip
								</button>
							) : (
								<button
									style={{
										padding: "6px 16px",
										borderRadius: "6px",
										background: "#e00",
										color: "#fff",
										border: "none",
										cursor: "pointer",
									}}
									disabled={isPending === row.id}
									onClick={() => handleUnequip(row.id)}>
									Remove
								</button>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
