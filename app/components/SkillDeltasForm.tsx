"use client";
import React from "react";
import { SkillDeltas } from "../types";
import { zeroSkillDeltas } from "../lib/utils";

interface Props {
	skillDeltas: SkillDeltas;
	health?: number;
	onSkillDeltasChange: (newSkillDeltas: SkillDeltas) => void;
	onHealthChange?: (health: number) => void;
}

export default function SkillDeltasForm({ skillDeltas, health, onSkillDeltasChange, onHealthChange }: Props) {
	function handleSkillDeltaChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		if (name === "health" && onHealthChange) {
			const healthValue = Number(value);
			onHealthChange(healthValue);
			onSkillDeltasChange({
				...skillDeltas,
				current_health: healthValue,
				max_health: healthValue,
			});
		} else {
			onSkillDeltasChange({
				...skillDeltas,
				[name]: Number(value),
			});
		}
	}

	return (
		<fieldset
			style={{
				border: "1px solid #ccc",
				borderRadius: 8,
				padding: 8,
				width: "100%",
				maxWidth: 900,
				margin: "0 auto",
			}}>
			<legend style={{ textAlign: "center", fontWeight: 500, fontSize: 18, marginBottom: 0 }}>Stats</legend>

			{/* Core Attributes */}
			<div style={{ display: "flex", gap: 8, marginBottom: 0, marginTop: 0, justifyContent: "center" }}>
				{[
					...(health !== undefined ? [{ key: "health", label: "Health", value: health }] : []),
					{ key: "armor_class", label: "Armor Class", value: skillDeltas.armor_class },
					...["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((key) => ({
						key,
						label: key.charAt(0).toUpperCase() + key.slice(1),
						value: skillDeltas[key as keyof SkillDeltas],
					})),
				].map(({ key, label, value }) => (
					<label
						key={key}
						style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90 }}>
						<span style={{ fontSize: 12 }}>{label}</span>
						<input
							type="number"
							name={key}
							value={key === "health" ? health : value}
							onChange={handleSkillDeltaChange}
							required
							style={{ width: 80, fontSize: 15, textAlign: "center" }}
						/>
					</label>
				))}
			</div>

			{/* Skills */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(8, 1fr)",
					gap: 8,
					justifyItems: "center",
					width: "100%",
					marginTop: 0,
				}}>
				{Object.entries(skillDeltas)
					.filter(
						([key]) =>
							![
								"strength",
								"dexterity",
								"constitution",
								"intelligence",
								"wisdom",
								"charisma",
								"current_health",
								"max_health",
								"armor_class",
							].includes(key)
					)
					.map(([key, value]) => {
						let labelText = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
						if (key === "sleight_of_hand") labelText = "Sleight of hand";
						if (key === "animal_handling") labelText = "Animal handling";
						return (
							<label
								key={key}
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									minWidth: 90,
									margin: 0,
								}}>
								<span style={{ fontSize: 12 }}>{labelText}</span>
								<input
									type="number"
									name={key}
									value={value}
									onChange={handleSkillDeltaChange}
									required
									style={{ width: 80, fontSize: 15, textAlign: "center", margin: 0 }}
								/>
							</label>
						);
					})}
			</div>
		</fieldset>
	);
}
