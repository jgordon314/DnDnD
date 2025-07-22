"use client";
import React, { useState } from "react";
import { AbilityType, SkillDeltas } from "../lib/types";
import { zeroSkillDeltas } from "../lib/models/skillDeltas/utils";
import SkillDeltasForm from "./SkillDeltasForm";

interface Props {
	onSubmit: (data: any) => void;
	onCancel: () => void;
}

export default function AbilityForm({ onSubmit, onCancel }: Props) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState<AbilityType>("action");
	const [skillDeltas, setSkillDeltas] = useState<SkillDeltas>(zeroSkillDeltas());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Ensure type is one of the valid enum values
		const validType = ["non-action", "action", "bonus-action", "reaction", "free-action"].includes(type)
			? type
			: "action";

		const formData = {
			name,
			description,
			type: validType,
			...skillDeltas, // Always include skill deltas
		};

		onSubmit(formData);
	};

	return (
		<div className="modal-container form-container">
			<div className="modal-content form-content">
				<h2 className="form-title">Create New Ability</h2>
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
							className="form-textarea"
							rows={6}
							required
							placeholder="Describe the ability's effects, range, duration, cooldown, prerequisites, etc."
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Type</label>
							<select
								value={type}
								onChange={(e) => setType(e.target.value as AbilityType)}
								className="form-select"
								required>
								<option value="non-action">Non-Action</option>
								<option value="action">Action</option>
								<option value="bonus-action">Bonus Action</option>
								<option value="reaction">Reaction</option>
								<option value="free-action">Free Action</option>
							</select>
						</div>
					</div>

					<div className="form-group">
						<h3 className="form-subtitle">Skill Modifiers</h3>
						<div style={{ padding: "10px 0" }}>
							<SkillDeltasForm skillDeltas={skillDeltas} onSkillDeltasChange={setSkillDeltas} />
						</div>
					</div>

					<div className="form-actions">
						<button type="button" onClick={onCancel} className="button button-secondary">
							Cancel
						</button>
						<button type="submit" className="button button-primary">
							Create Ability
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
