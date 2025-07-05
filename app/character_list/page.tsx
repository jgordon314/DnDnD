"use client";
import Image from "next/image";
import "./../temp.css";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import Modal from "./../modal";

interface Character {
	id: number;
	name: string;
}

interface SkillDeltasInput {
	armor_class: number;
	current_health: number;
	max_health: number;
	strength: number;
	dexterity: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
	constitution: number;
	athletics: number;
	acrobatics: number;
	sleight_of_hand: number;
	stealth: number;
	arcana: number;
	history: number;
	investigation: number;
	nature: number;
	religion: number;
	animal_handling: number;
	insight: number;
	medicine: number;
	perception: number;
	survival: number;
	deception: number;
	intimidation: number;
	performance: number;
	persuasion: number;
}

export default function Home() {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [isModalOpen, setModalOpen] = useState(false);
	const [name, setName] = useState("");
	const { data: session } = useSession();
	const [health, setHealth] = useState(0);
	const [skillDeltas, setSkillDeltas] = useState<SkillDeltasInput>({
		armor_class: 0,
		current_health: 0,
		max_health: 0,
		strength: 0,
		dexterity: 0,
		intelligence: 0,
		wisdom: 0,
		charisma: 0,
		constitution: 0,
		athletics: 0,
		acrobatics: 0,
		sleight_of_hand: 0,
		stealth: 0,
		arcana: 0,
		history: 0,
		investigation: 0,
		nature: 0,
		religion: 0,
		animal_handling: 0,
		insight: 0,
		medicine: 0,
		perception: 0,
		survival: 0,
		deception: 0,
		intimidation: 0,
		performance: 0,
		persuasion: 0,
	});
	// Accept string or number, but always use number for player_id
	const player_id: number | undefined = session?.user?.id ? Number(session.user.id) : undefined;

	useEffect(() => {
		if (!player_id) return;
		async function fetchCharacters() {
			const res = await fetch(`api/characters/${player_id}`, {
				method: "GET",
			});
			const data = await res.json();
			setCharacters(data);
		}

		fetchCharacters();
	}, [player_id]);

	async function handleDelete(id: number) {
		await fetch(`api/characters/${id}`, {
			method: "DELETE",
		});
		setCharacters(characters.filter((char) => char.id != id));
		console.log("deleted", id);
	}

	function toggleModal() {
		if (isModalOpen) {
			setModalOpen(false);
		} else setModalOpen(true);
	}

	function handleSkillDeltaChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		if (name === "health") {
			setHealth(Number(value));
			setSkillDeltas((prev) => ({ ...prev, current_health: Number(value), max_health: Number(value) }));
		} else {
			setSkillDeltas((prev) => ({ ...prev, [name]: Number(value) }));
		}
	}

	async function createCharacter(e: FormEvent) {
		e.preventDefault();
		console.log("Submitting name:", name, skillDeltas);
		if (!name.trim()) {
			console.warn("Name cannot be empty");
			return;
		}
		if (!player_id) {
			console.warn("No player_id found in session");
			return;
		}
		const payload = { name, ...skillDeltas, current_health: health, max_health: health, player_id };
		const res = await fetch("api/characters", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			const refreshed = await fetch(`api/characters/${player_id}`, {
				method: "GET",
			});
			if (refreshed.ok) {
				const data = await refreshed.json();
				setCharacters(data);
			} else {
				console.error("Failed to refresh character list");
			}
			setName("");
			setHealth(0);
			setSkillDeltas({
				armor_class: 0,
				current_health: 0,
				max_health: 0,
				strength: 0,
				dexterity: 0,
				intelligence: 0,
				wisdom: 0,
				charisma: 0,
				constitution: 0,
				athletics: 0,
				acrobatics: 0,
				sleight_of_hand: 0,
				stealth: 0,
				arcana: 0,
				history: 0,
				investigation: 0,
				nature: 0,
				religion: 0,
				animal_handling: 0,
				insight: 0,
				medicine: 0,
				perception: 0,
				survival: 0,
				deception: 0,
				intimidation: 0,
				performance: 0,
				persuasion: 0,
			});
			setModalOpen(false);
			console.log("created character");
		} else {
			const errorText = await res.text();
			console.error("Failed to create character", errorText);
		}
	}
	if (session) {
		return (
			<div className="paulward">
				<h1>Signed in as: {session.user?.name}</h1>
				<table>
					<caption>Character List</caption>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						{characters.map((row: Character) => (
							<tr key={row.id}>
								<td>{row.id}</td>
								<td>{row.name}</td>
								<td>
									<button className="delete" onClick={() => handleDelete(row.id)}>
										X
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<button onClick={toggleModal} style={{ display: "block", margin: "32px auto", fontSize: 18, padding: "8px 32px" }}>Add New Character</button>

				<Modal isOpen={isModalOpen} onClose={toggleModal}>
					<div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 32px rgba(0,0,0,0.18)", padding: 32, minWidth: 900, maxWidth: 1200, position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000 }}>
						<form onSubmit={createCharacter} style={{ minWidth: 700, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
							<label style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginBottom: 16 }}>
								<span style={{ fontWeight: 500, marginBottom: 4 }}>Name:</span>
								<input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: 300, fontSize: 18, textAlign: "center" }} />
							</label>
							<br />
							<fieldset style={{ border: "1px solid #ccc", borderRadius: 8, padding: 8, width: "100%", maxWidth: 900, margin: "0 auto" }}>
								<legend style={{ textAlign: "center", fontWeight: 500, fontSize: 18, marginBottom: 0 }}>Character Attributes</legend>
								<div style={{ display: "flex", gap: 8, marginBottom: 0, marginTop: 0, justifyContent: "center" }}>
									{[
										{ key: "health", label: "Health", value: health },
										{ key: "armor_class", label: "Armor Class", value: skillDeltas.armor_class },
										...["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((key) => ({
											key,
											label: key.charAt(0).toUpperCase() + key.slice(1),
											value: skillDeltas[key as keyof SkillDeltasInput],
										})),
									].map(({ key, label, value }) => (
										<label key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90 }}>
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
								<div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8, justifyItems: "center", width: "100%", marginTop: 0 }}>
									{Object.entries(skillDeltas)
										.filter(([key]) => !["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma", "current_health", "max_health", "armor_class"].includes(key))
										.map(([key, value]) => {
											let labelText = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
											if (key === "sleight_of_hand") labelText = "Sleight of hand";
											return (
												<label key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90, margin: 0 }}>
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
							<br />
							<div style={{ display: "flex", gap: 16, justifyContent: "center", width: "100%" }}>
								<button type="button" onClick={toggleModal} style={{ fontSize: 18, padding: "8px 32px", background: "#eee", color: "#333", border: "1px solid #ccc", borderRadius: 6 }}>Back</button>
								<button type="submit" style={{ fontSize: 18, padding: "8px 32px", margin: "0 auto", display: "block" }}>Add Character</button>
							</div>
						</form>
					</div>
				</Modal>
			</div>
		);
	} else {
		return (
			<>
				Not signed in <br />
				<button onClick={() => signIn()}>Sign in</button>
			</>
		);
	}
}