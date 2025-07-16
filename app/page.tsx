"use client";
import "./temp.css";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

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
