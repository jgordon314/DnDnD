"use client";
import React, { useState } from "react";
import { SkillDeltas } from "../lib/types";
import { zeroSkillDeltas } from "../lib/models/skillDeltas/utils";
import SkillDeltasForm from "./SkillDeltasForm";

interface Props {
	onSubmit: (data: any) => void;
	onCancel: () => void;
}

export default function SpellForm({ onSubmit, onCancel }: Props) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [level, setLevel] = useState(0);
	const [duration, setDuration] = useState(0);
	const [castingTime, setCastingTime] = useState("");
	const [spellRange, setSpellRange] = useState("");
	const [components, setComponents] = useState("");
	const [skillDeltas, setSkillDeltas] = useState<SkillDeltas>(zeroSkillDeltas());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formData = {
			name,
			description,
			level,
			duration,
			casting_time: castingTime,
			spell_range: spellRange,
			components,
			...skillDeltas,
		};

		onSubmit(formData);
	};

	return (
		<div className="modal-container form-container">
			<div className="modal-content form-content">
				<h2 className="form-title">Create New Spell</h2>
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
							rows={3}
							required
							placeholder="Describe what the spell does..."
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Level</label>
							<input
								type="number"
								min="0"
								max="9"
								value={level}
								onChange={(e) => setLevel(parseInt(e.target.value || "0"))}
								className="form-input"
								required
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Duration (seconds)</label>
							<input
								type="number"
								min="0"
								value={duration}
								onChange={(e) => setDuration(parseInt(e.target.value || "0"))}
								className="form-input"
								required
							/>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Casting Time</label>
							<input
								type="text"
								value={castingTime}
								onChange={(e) => setCastingTime(e.target.value)}
								className="form-input"
								placeholder="e.g., 1 action, 1 minute"
								required
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Range</label>
							<input
								type="text"
								value={spellRange}
								onChange={(e) => setSpellRange(e.target.value)}
								className="form-input"
								placeholder="e.g., 30 feet, Self"
								required
							/>
						</div>
					</div>

					<div className="form-group">
						<label className="form-label">Components</label>
						<input
							type="text"
							value={components}
							onChange={(e) => setComponents(e.target.value)}
							className="form-input"
							placeholder="e.g., V, S, M"
							required
						/>
					</div>

					<div className="form-group">
						<h3 className="form-subtitle">Skill Modifiers</h3>
						<SkillDeltasForm skillDeltas={skillDeltas} onSkillDeltasChange={setSkillDeltas} />
					</div>

					<div className="form-actions">
						<button type="button" onClick={onCancel} className="button button-secondary">
							Cancel
						</button>
						<button type="submit" className="button button-primary">
							Create Spell
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
