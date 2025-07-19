"use client";
import { useState } from "react";
import { Ability, CharacterAbility } from "@/app/types";

interface Props {
	rows: (Ability & CharacterAbility)[];
	characterId: number;
}

export function CharacterAbilitiesTableClient({ rows: initialRows, characterId }: Props) {
	const [rows, setRows] = useState<(Ability & CharacterAbility)[]>(initialRows);
	const [isPending, setPending] = useState<number | null>(null);

	async function handleRemove(abilityId: number) {
		setPending(abilityId);
		try {
			const response = await fetch("/api/remove-ability", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ characterId, abilityId }),
			});

			if (response.ok) {
				setRows(rows.filter((row) => row.id !== abilityId));
			} else {
				console.error("Failed to remove ability:", await response.text());
			}
		} catch (error) {
			console.error("Error removing ability:", error);
		} finally {
			setPending(null);
		}
	}

	return (
		<table>
			<thead>
				<tr>
					<th>Ability Name</th>
					<th>Activation Count</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.id}>
						<td>{row.name}</td>
						<td>{row.activation_count}</td>
						<td>
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
								onClick={() => handleRemove(row.id)}>
								Remove
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
