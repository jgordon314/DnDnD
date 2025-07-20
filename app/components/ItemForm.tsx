"use client";
import React, { useState, useEffect } from "react";
import { Ability } from "../types";

interface Props {
	onSubmit: (data: any) => void;
	onCancel: () => void;
}

export default function ItemForm({ onSubmit, onCancel }: Props) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [abilityId, setAbilityId] = useState<number | null>(null);
	const [abilities, setAbilities] = useState<Ability[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchAbilities = async () => {
			setIsLoading(true);
			try {
				const response = await fetch("/api/abilities");
				if (!response.ok) {
					throw new Error("Failed to fetch abilities");
				}
				const data = await response.json();
				console.log("abilities", data);
				setAbilities(data);
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

		const formData = {
			name,
			description,
			ability_id: abilityId,
		};

		onSubmit(formData);
	};

	return (
		<div className="modal-container form-container">
			<div className="modal-content form-content">
				<h2 className="form-title">Create New Item</h2>
				<form onSubmit={handleSubmit} className="form scrollable-form">
					<div className="form-group">
						<label className="form-label">Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="form-input"
							required
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe the item's properties, effects, and other details. For example: A sword that flickers with icy blue flames. Deals fire and cold damage. Cost: 10 gp, Weight: 3 lbs, Damage: 1d8 + 1d4 cold."
							className="form-textarea"
							rows={6}
							required
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Associated Ability (Optional)</label>
						{isLoading ? (
							<div>Loading abilities...</div>
						) : (
							<select
								value={abilityId || ""}
								onChange={(e) => setAbilityId(e.target.value ? parseInt(e.target.value) : null)}
								className="form-select">
								<option key="none" value="">
									None
								</option>
								{abilities.map((ability) => (
									<option key={ability.id} value={ability.id}>
										{ability.name}
									</option>
								))}
							</select>
						)}
					</div>

					<div className="form-actions">
						<button type="button" onClick={onCancel} className="button button-secondary">
							Cancel
						</button>
						<button type="submit" className="button button-primary">
							Create Item
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
