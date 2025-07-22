"use client";
import { useState } from "react";
import { CharacterItem, Item } from "@/app/lib/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";

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
			setPending(null);
			console.error("Error unequipping item:", error);
		}
	}

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Item Name</TableHead>
						<TableHead>Item Count</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.id}>
							<TableCell>{row.name}</TableCell>
							<TableCell>{row.quantity}</TableCell>
							<TableCell>
								{row.activation_count === -1 ? (
									<Button
										disabled={isPending == row.id}
										onClick={() => handleEquip(row.id)}
									>
										Equip
									</Button>
								) : (
									<Button
										variant="destructive"
										disabled={isPending == row.id}
										onClick={() => handleUnequip(row.id)}
									>
										Remove
									</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
