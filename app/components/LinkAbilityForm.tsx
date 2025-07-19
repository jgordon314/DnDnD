"use client";
import React, { useState, useEffect } from "react";
import { Ability, Character } from "../types";

interface CharacterAbilityLink {
	character_id: number;
	ability_id: number;
	max_uses: number | null;
	available_uses: number | null;
	activation_count: number;
}

interface Props {
	onSubmit: (data: CharacterAbilityLink) => void;
	onCancel: () => void;
	characters?: Character[];
}

export default function LinkAbilityForm({ onSubmit, onCancel, characters = [] }: Props) {
	const [characterId, setCharacterId] = useState<number | "">("");
	const [abilityId, setAbilityId] = useState<number | "">("");
	const [maxUses, setMaxUses] = useState<string>("");
	const [availableUses, setAvailableUses] = useState<string>("");
	const [abilities, setAbilities] = useState<Ability[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchAbilities = async () => {
			setIsLoading(true);
			try {
				const response = await fetch("/api/abilities");
				if (response.ok) {
					const data = await response.json();
					const validAbilities = Array.isArray(data)
						? data.filter((ability) => ability && ability.id !== null && ability.id !== undefined)
						: [];
					setAbilities(validAbilities);
				} else {
					console.error("Failed to fetch abilities");
				}
			} catch (error) {
				console.error("Error fetching abilities:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAbilities();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!characterId || !abilityId) {
			alert("Please select both a character and an ability");
			return;
		}

		const charId = typeof characterId === "string" ? parseInt(characterId, 10) : characterId;
		const abilId = typeof abilityId === "string" ? parseInt(abilityId, 10) : abilityId;

		if (isNaN(charId) || isNaN(abilId)) {
			alert("Invalid character or ability ID");
			return;
		}

		const formData: CharacterAbilityLink = {
			character_id: charId,
			ability_id: abilId,
			max_uses: maxUses === "" ? null : Number(maxUses),
			available_uses: availableUses === "" ? null : Number(availableUses),
			activation_count: 0,
		};

		onSubmit(formData);
	};

	return (
		<div className="modal-container form-container">
			<div className="modal-content form-content">
				<h2 className="form-title">Link Ability to Character</h2>
				{isLoading ? (
					<p className="form-loading">Loading abilities...</p>
				) : (
					<form onSubmit={handleSubmit} className="form scrollable-form">
						<div className="form-group">
							<label className="form-label">Character</label>
							<select
								value={characterId}
								onChange={(e) => setCharacterId(e.target.value ? Number(e.target.value) : "")}
								className="form-select"
								required>
								<option value="">Select a character</option>
								{characters.map((character) => (
									<option
										key={character.id || `character-${Math.random()}`}
										value={character.id}
										title={character.name}
										className="text-ellipsis overflow-hidden">
										{character.name.length > 35
											? `${character.name.substring(0, 32)}...`
											: character.name}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label className="form-label">Ability</label>
							<select
								value={abilityId}
								onChange={(e) => setAbilityId(e.target.value ? Number(e.target.value) : "")}
								className="form-select"
								required>
								<option value="">Select an ability</option>
								{abilities.map((ability) => (
									<option
										key={ability.aid || `ability-${Math.random()}`}
										value={ability.aid}
										title={`${ability.name} (${ability.type})`}
										className="text-ellipsis overflow-hidden">
										{ability.name.length > 30
											? `${ability.name.substring(0, 27)}...`
											: ability.name}{" "}
										({ability.type})
									</option>
								))}
							</select>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Maximum Uses</label>
								<input
									type="number"
									min="1"
									value={maxUses}
									onChange={(e) => setMaxUses(e.target.value)}
									className="form-input"
									placeholder="Unlimited if blank"
								/>
							</div>

							<div className="form-group">
								<label className="form-label">Available Uses</label>
								<input
									type="number"
									min="0"
									value={availableUses}
									onChange={(e) => setAvailableUses(e.target.value)}
									className="form-input"
									placeholder="Same as max if blank"
								/>
							</div>
						</div>

						<p className="form-help-text">Leave fields blank for unlimited uses</p>

						<div className="form-actions">
							<button type="button" onClick={onCancel} className="button button-secondary">
								Cancel
							</button>
							<button type="submit" className="button button-primary">
								Link Ability
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
