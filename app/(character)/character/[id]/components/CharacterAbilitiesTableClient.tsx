"use client";
import { useState } from "react";
import { Ability, CharacterAbility } from "@/app/lib/types";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";

interface Props {
	rows: (Ability & CharacterAbility)[];
	characterId: number;
}

export function CharacterAbilitiesTableClient({ rows: initialRows, characterId }: Props) {
	const [rows, setRows] = useState<(Ability & CharacterAbility)[]>(initialRows);
	const [isPending, setPending] = useState<number | null>(null);
	const [showLimitModal, setShowLimitModal] = useState(false);
	const [selectedAbility, setSelectedAbility] = useState<(Ability & CharacterAbility) | null>(null);
	const [maxUses, setMaxUses] = useState<number | null>(null);
	const [availableUses, setAvailableUses] = useState<number | null>(null);

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

	function openLimitModal(ability: Ability & CharacterAbility) {
		setSelectedAbility(ability);
		setMaxUses(ability.max_uses);
		setAvailableUses(ability.available_uses);
		setShowLimitModal(true);
	}

	async function handleUpdateLimits() {
		if (!selectedAbility) return;

		setPending(selectedAbility.id);
		try {
			const response = await fetch("/api/update-ability-limits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					characterId,
					abilityId: selectedAbility.id,
					maxUses,
					availableUses,
				}),
			});

			if (response.ok) {
				// Update the local state with the new values
				setRows(
					rows.map((row) =>
						row.id === selectedAbility.id
							? { ...row, max_uses: maxUses, available_uses: availableUses }
							: row
					)
				);
				setShowLimitModal(false);
			} else {
				console.error("Failed to update ability limits:", await response.text());
			}
		} catch (error) {
			console.error("Error updating ability limits:", error);
		} finally {
			setPending(null);
		}
	}

	async function updateActivation(abilityId: number, delta: number) {
		setPending(abilityId);
		await fetch("/api/ability-activation", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ characterId, abilityId, delta }),
		});
		// Update local state for available_uses if not unlimited
		setRows((prevRows) =>
			prevRows.map((row) => {
				if (row.ability_id === abilityId) {
					let newAvailable = row.available_uses;
					if (newAvailable !== null) {
						newAvailable = Math.max(0, newAvailable - delta);
					}
					return {
						...row,
						activation_count: row.activation_count + delta,
						available_uses:
							row.available_uses !== null && delta > 0
								? Math.max(0, row.available_uses - 1)
								: row.available_uses !== null && delta < 0
									? row.available_uses + 1
									: row.available_uses,
					};
				}
				return row;
			})
		);
		setPending(null);
	}

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Ability Name</TableHead>
						<TableHead>Activation Count</TableHead>
						<TableHead>Max Uses</TableHead>
						<TableHead>Available Uses</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<tbody>
					{rows.map((row, index) => (
						<TableRow key={row.id || `ability-${row.ability_id}-${index}`}>
							<TableCell>{row.name}</TableCell>
							<TableCell>
								<div
									className="flex w-full max-w-sm items-center gap-2"
								>
									<Button
										variant="ghost"
										disabled={isPending === row.id || row.activation_count === 0}
										onClick={() => updateActivation(row.id, -1)}
									>-</Button>
									<div>{row.activation_count}</div>
									<Button
										variant="ghost"
										disabled={
											isPending === row.id ||
											(row.available_uses !== null && row.available_uses === 0)
										}
										onClick={() => updateActivation(row.id, 1)}
									>+</Button>
								</div>
							</TableCell>
							<TableCell>{row.max_uses === null ? "Unlimited" : row.max_uses}</TableCell>
							<TableCell>{row.available_uses === null ? "Unlimited" : row.available_uses}</TableCell>
							<TableCell className="flex space-x-2">
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
									onClick={() => openLimitModal(row)}>
									Set Limits
								</button>
							</TableCell>
						</TableRow>
					))}
				</tbody>
			</Table>

			{showLimitModal && selectedAbility && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h3 className="text-xl font-bold mb-4">Set Usage Limits for {selectedAbility.name}</h3>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Max Uses (leave blank for unlimited)
							</label>
							<input
								type="number"
								min="0"
								value={maxUses === null ? "" : maxUses}
								onChange={(e) => setMaxUses(e.target.value === "" ? null : parseInt(e.target.value))}
								className="w-full p-2 border rounded"
							/>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Available Uses (leave blank for unlimited)
							</label>
							<input
								type="number"
								min="0"
								value={availableUses === null ? "" : availableUses}
								onChange={(e) =>
									setAvailableUses(e.target.value === "" ? null : parseInt(e.target.value))
								}
								className="w-full p-2 border rounded"
							/>
						</div>

						<div className="flex justify-end gap-2">
							<button
								onClick={() => setShowLimitModal(false)}
								className="px-4 py-2 border rounded"
								disabled={isPending === selectedAbility.id}>
								Cancel
							</button>
							<button
								onClick={handleUpdateLimits}
								className="px-4 py-2 bg-blue-500 text-white rounded"
								disabled={isPending === selectedAbility.id}>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
