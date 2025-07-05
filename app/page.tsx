"use client";
import Image from "next/image";
import conn from "./lib/db";
import "./temp.css";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import Modal from "./modal";

interface Character {
	id: number;
	name: string;
	health: number;
}

export default function Home() {
	const { data: session } = useSession();
	const [characters, setCharacters] = useState<Character[]>([]);
	const [isModalOpen, setModalOpen] = useState(false);
	const [name, setName] = useState("");
	const [health, setHealth] = useState(50);

	useEffect(() => {
		async function fetchCharacters() {
			const res = await fetch("/api/characters");
			const data = await res.json();
			setCharacters(data);
		}

		fetchCharacters();
	}, []);

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

	async function createCharacter(e: FormEvent) {
		await fetch("api/characters", {
			method: "POST",
			body: JSON.stringify({ name, health }),
		});
		console.log("created character", name);
	}
	if (session) {
		return (
			<div className="paulward">
				<h1>signed in as: {session.user.name}</h1>
				<table>
					<caption>Character List</caption>

					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Health</th>
						</tr>
					</thead>
					<tbody>
						{characters.map((row: Character) => (
							<tr key={row.id}>
								<td>{row.id}</td>
								<td>{row.name}</td>
								<td>{row.health}</td>
								<td>
									<button className="delete" onClick={() => handleDelete(row.id)}>
										X
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<button onClick={toggleModal}>Add New Character</button>

				<Modal isOpen={isModalOpen} onClose={toggleModal}>
					<form onSubmit={createCharacter}>
						<h2>Add New Character</h2>
						<label>
							Name:
							<input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
						</label>

						<label htmlFor="">
							Health:
							<input
								type="text"
								value={health}
								onChange={(e) => setHealth(Number(e.target.value))}
								required
							/>
						</label>
						<br />
						<button type="submit">Add Character</button>
					</form>
				</Modal>
			</div>
		);
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
}
