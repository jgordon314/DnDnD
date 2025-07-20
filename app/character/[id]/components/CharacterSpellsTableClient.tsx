"use client";
import { useState } from "react";
import { Spell, CharacterSpell } from "@/app/types";

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
		<table>
			<thead>
				<tr>
					<th>Spell Name</th>
					<th>Level</th>
					<th>Casting Time</th>
					<th>Duration</th>
					<th>Activation Count</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.id}>
						<td>{row.name}</td>
						<td>{row.level}</td>
						<td>{row.casting_time}</td>
						<td>{row.duration}</td>
						<td>{row.activations}</td>
						<td>
							<div style={{ display: "flex", gap: "8px" }}>
								<button
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
								</button>
								<button
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
								</button>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
