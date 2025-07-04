"use client";
import "./temp.css";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

interface Character {
	id: number;
	name: string;
	health: number;
}

export default function Home() {
	const { data: session } = useSession();

	if (session) {
		redirect("/character_list");
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
}
