"use client";
import { useState } from "react";
import { Spell, CharacterSpell } from "@/app/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";

interface Props {
	rows: (Spell & CharacterSpell)[];
	characterId: number;
}

export function CharacterSpellsTableClient({ rows: initialRows, characterId }: Props) {
	const [rows, setRows] = useState<(Spell & CharacterSpell)[]>(initialRows);
	const [isPending, setPending] = useState<number | null>(null);
	const [pendingAction, setPendingAction] = useState<string | null>(null);

	async function handleRemove(spellId: number) {
		setPending(spellId);
		setPendingAction("remove");
		try {
			const response = await fetch("/api/remove-spell", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ characterId, spellId }),
			});

			if (response.ok) {
				setRows(rows.filter((row) => row.id !== spellId));
			} else {
				console.error("Failed to remove spell:", await response.text());
			}
		} catch (error) {
			console.error("Error removing spell:", error);
		} finally {
			setPending(null);
			setPendingAction(null);
		}
	}

	async function handleActivate(spellId: number) {
		setPending(spellId);
		setPendingAction("activate");
		console.log("Activating spell:", { characterId, spellId });
		try {
			const url = `/api/characters/${characterId}/${spellId}`;
			console.log("Fetching URL:", url);
			const response = await fetch(url, {
				method: "GET", // Using the existing GET endpoint
				cache: "no-store", // Prevent caching of the request
			});
			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}
			const result = await response.json();
			console.log("Activation response:", result);
			setRows(
				rows.map((row) => {
					if (row.id === spellId) {
						return {
							...row,
							activations: (row.activations || 0) + 1,
						};
					}
					return row;
				})
			);
		} catch (error) {
			console.error("Error activating spell:", error);
		} finally {
			setPending(null);
			setPendingAction(null);
		}
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Spell Name</TableHead>
					<TableHead>Level</TableHead>
					<TableHead>Casting Time</TableHead>
					<TableHead>Duration</TableHead>
					<TableHead>Activation Count</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row) => (
					<TableRow key={row.id}>
						<TableCell>{row.name}</TableCell>
						<TableCell>{row.level}</TableCell>
						<TableCell>{row.casting_time}</TableCell>
						<TableCell>{row.duration}</TableCell>
						<TableCell>{row.activations}</TableCell>
						<TableCell>
							<div style={{ display: "flex", gap: "8px" }}>
								<Button
									style={{
										padding: "6px 16px",
										borderRadius: "6px",
										background: "#0070f3",
										color: "#fff",
										border: "none",
										cursor: "pointer",
									}}
									disabled={isPending === row.id && pendingAction === "activate"}
									onClick={() => handleActivate(row.id)}>
									Activate
								</Button>
								<Button
									style={{
										padding: "6px 16px",
										borderRadius: "6px",
										background: "#e00",
										color: "#fff",
										border: "none",
										cursor: "pointer",
									}}
									disabled={isPending === row.id && pendingAction === "remove"}
									onClick={() => handleRemove(row.id)}>
									Remove
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
