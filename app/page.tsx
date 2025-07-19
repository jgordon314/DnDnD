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
	const { data: session, status } = useSession();

	console.log("Home page - Session status:", status);
	console.log("Home page - Session data:", session);

	// Delay redirect to allow logging
	if (status === "loading") {
		return <div>Loading session...</div>;
	}

	if (session) {
		console.log("Home page - Redirecting to character list");
		redirect("/character_list");
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
}
