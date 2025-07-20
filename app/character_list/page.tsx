"use client";
import "./../temp.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import Modal from "./../modal";
import { type Character, type SkillDeltas } from "../types";
import Link from "next/link";
import { zeroSkillDeltas } from "../lib/utils";
import SkillDeltasForm from "../components/SkillDeltasForm";
import SpellForm from "../components/SpellForm";
import ItemForm from "../components/ItemForm";
import AbilityForm from "../components/AbilityForm";
import LinkAbilityForm from "../components/LinkAbilityForm";

export default function Home() {
	console.log("Character list page rendering");

	const [characters, setCharacters] = useState<Character[]>([]);
	const [isCharacterModalOpen, setCharacterModalOpen] = useState(false);
	const [isItemModalOpen, setItemModalOpen] = useState(false);
	const [isSpellModalOpen, setSpellModalOpen] = useState(false);
	const [isAbilityModalOpen, setAbilityModalOpen] = useState(false);
	const [isLinkAbilityModalOpen, setLinkAbilityModalOpen] = useState(false);
	const [name, setName] = useState("");

	const { data: session, status } = useSession();
	console.log("Character list - Session status:", status);
	console.log("Character list - Session data:", session);

	const [health, setHealth] = useState(0);
	const [skillDeltas, setSkillDeltas] = useState<SkillDeltas>(zeroSkillDeltas());

	const player_id: number | undefined = session?.user?.id ? Number(session.user.id) : undefined;
	console.log("Character list - Player ID:", player_id);

	useEffect(() => {
		console.log("useEffect triggered with player_id:", player_id);
		if (!player_id) {
			console.log("No player_id, skipping character fetch");
			return;
		}

		async function fetchCharacters() {
			console.log("Fetching characters for player:", player_id);
			try {
				const res = await fetch(`/api/characters/${player_id}`, {
					method: "GET",
				});
				console.log("API response status:", res.status);
				if (!res.ok) {
					console.error("Error fetching characters:", await res.text());
					return;
				}
				const data = await res.json();
				console.log("Characters fetched:", data);
				setCharacters(data);
			} catch (error) {
				console.error("Error in fetchCharacters:", error);
			}
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

	function toggleCharacterModal() {
		setCharacterModalOpen(!isCharacterModalOpen);
	}

	function toggleItemModal() {
		setItemModalOpen(!isItemModalOpen);
	}

	function toggleSpellModal() {
		setSpellModalOpen(!isSpellModalOpen);
	}

	function toggleAbilityModal() {
		setAbilityModalOpen(!isAbilityModalOpen);
	}

	function toggleLinkAbilityModal() {
		setLinkAbilityModalOpen(!isLinkAbilityModalOpen);
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
			setSkillDeltas(zeroSkillDeltas());
			setCharacterModalOpen(false);
			console.log("created character");
		} else {
			const errorText = await res.text();
			console.error("Failed to create character", errorText);
		}
	}

	if (session) {
		return (
			<div className="paulward">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "20px",
					}}>
					<h1>Signed in as: {session.user?.name}</h1>
					<button
						onClick={() => signOut()}
						style={{
							margin: "5px",
							padding: "8px 16px",
							color: "white",
							border: "none",
							textDecoration: "underline",
							borderRadius: "4px",
							cursor: "pointer",
						}}>
						Logout
					</button>
				</div>
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
								<td>
									<Link href={`/character/${row.id}`}>{row.name}</Link>
								</td>
								<td>
									<button className="delete" onClick={() => handleDelete(row.id)}>
										X
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "16px",
						maxWidth: "500px",
						margin: "32px auto",
					}}>
					<button onClick={toggleCharacterModal} style={{ fontSize: 18, padding: "8px 32px" }}>
						Add New Character
					</button>
					<button onClick={toggleItemModal} style={{ fontSize: 18, padding: "8px 32px" }}>
						Add New Item
					</button>
					<button onClick={toggleSpellModal} style={{ fontSize: 18, padding: "8px 32px" }}>
						Add New Spell
					</button>
					<button onClick={toggleAbilityModal} style={{ fontSize: 18, padding: "8px 32px" }}>
						Add New Ability
					</button>
					<button onClick={toggleLinkAbilityModal} style={{ fontSize: 18, padding: "8px 32px" }}>
						Link Ability to Character
					</button>
				</div>

				{/* Character Creation Modal */}
				<Modal isOpen={isCharacterModalOpen} onClose={toggleCharacterModal}>
					<div
						style={{
							background: "#fff",
							borderRadius: 12,
							boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
							padding: "24px",
							width: "90%",
							maxWidth: "1000px",
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: 1000,
							maxHeight: "90vh",
							overflow: "auto",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<form
							onSubmit={createCharacter}
							style={{
								minWidth: 700,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								width: "100%",
							}}>
							<label
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "100%",
									marginBottom: 16,
								}}>
								<span style={{ fontWeight: 500, marginBottom: 4 }}>Name:</span>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									style={{ width: 300, fontSize: 18, textAlign: "center" }}
								/>
							</label>
							<br />
							<SkillDeltasForm
								skillDeltas={skillDeltas}
								health={health}
								onSkillDeltasChange={setSkillDeltas}
								onHealthChange={setHealth}
							/>
							<br />
							<div style={{ display: "flex", gap: 16, justifyContent: "center", width: "100%" }}>
								<button
									type="button"
									onClick={toggleCharacterModal}
									style={{
										fontSize: 18,
										padding: "8px 32px",
										background: "#eee",
										color: "#333",
										border: "1px solid #ccc",
										borderRadius: 6,
									}}>
									Back
								</button>
								<button
									type="submit"
									style={{ fontSize: 18, padding: "8px 32px", margin: "0 auto", display: "block" }}>
									Add Character
								</button>
							</div>
						</form>
					</div>
				</Modal>

				{/* Item Creation Modal */}
				<Modal isOpen={isItemModalOpen} onClose={toggleItemModal}>
					<div
						style={{
							background: "#fff",
							borderRadius: 12,
							boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
							padding: "24px",
							width: "90%",
							maxWidth: "1000px",
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: 1000,
							maxHeight: "90vh",
							overflow: "auto",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<ItemForm
							onSubmit={async (formData) => {
								console.log("Creating item:", formData);
								try {
									const response = await fetch("/api/items", {
										method: "POST",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify(formData),
									});

									if (!response.ok) {
										const errorData = await response.json();
										throw new Error(errorData.error || "Failed to create item");
									}

									setItemModalOpen(false);
								} catch (error) {
									console.error("Error creating item:", error);
									alert(
										"Failed to create item: " +
											(error instanceof Error ? error.message : String(error))
									);
								}
							}}
							onCancel={toggleItemModal}
						/>
					</div>
				</Modal>

				{/* Spell Creation Modal */}
				<Modal isOpen={isSpellModalOpen} onClose={toggleSpellModal}>
					<div
						style={{
							background: "#fff",
							borderRadius: 12,
							boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
							padding: "24px",
							width: "90%",
							maxWidth: "1000px",
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: 1000,
							maxHeight: "90vh",
							overflow: "auto",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<SpellForm
							onSubmit={async (formData) => {
								console.log("Creating spell:", formData);
								try {
									const response = await fetch("/api/spells", {
										method: "POST",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify(formData),
									});

									if (!response.ok) {
										const errorData = await response.json();
										throw new Error(errorData.error || "Failed to create spell");
									}

									setSpellModalOpen(false);
								} catch (error) {
									console.error("Error creating spell:", error);
									alert(
										"Failed to create spell: " +
											(error instanceof Error ? error.message : String(error))
									);
								}
							}}
							onCancel={toggleSpellModal}
						/>
					</div>
				</Modal>

				{/* Ability Creation Modal */}
				<Modal isOpen={isAbilityModalOpen} onClose={toggleAbilityModal}>
					<div
						style={{
							background: "#fff",
							borderRadius: 12,
							boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
							padding: "24px",
							width: "90%",
							maxWidth: "1000px",
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: 1000,
							maxHeight: "90vh",
							overflow: "auto",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<AbilityForm
							onSubmit={async (formData) => {
								console.log("Creating ability:", formData);
								try {
									const response = await fetch("/api/abilities", {
										method: "POST",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify(formData),
									});

									if (!response.ok) {
										const errorData = await response.json();
										throw new Error(errorData.error || "Failed to create ability");
									}

									setAbilityModalOpen(false);
								} catch (error) {
									console.error("Error creating ability:", error);
									alert(
										"Failed to create ability: " +
											(error instanceof Error ? error.message : String(error))
									);
								}
							}}
							onCancel={toggleAbilityModal}
						/>
					</div>
				</Modal>

				{/* Link Ability to Character Modal */}
				<Modal isOpen={isLinkAbilityModalOpen} onClose={toggleLinkAbilityModal}>
					<div
						style={{
							background: "#fff",
							borderRadius: 12,
							boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
							padding: "24px",
							width: "90%",
							maxWidth: "500px",
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: 1000,
							maxHeight: "85vh",
							overflow: "auto",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<LinkAbilityForm
							characters={characters.filter((char) => char && char.id !== null && char.id !== undefined)}
							onSubmit={async (formData) => {
								console.log("Linking ability to character:", formData);
								try {
									const response = await fetch("/api/link-ability", {
										method: "POST",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify(formData),
									});

									if (!response.ok) {
										const errorData = await response.json();
										throw new Error(errorData.error || "Failed to link ability to character");
									}

									setLinkAbilityModalOpen(false);
								} catch (error) {
									console.error("Error linking ability to character:", error);
									alert(
										"Failed to link ability to character: " +
											(error instanceof Error ? error.message : String(error))
									);
								}
							}}
							onCancel={toggleLinkAbilityModal}
						/>
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
