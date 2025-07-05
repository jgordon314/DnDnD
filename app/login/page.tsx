"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		console.log("submitted", username, password);

		const result = await signIn("credentials", {
			redirect: false,
			username: username,
			password: password,
		});

		if (result?.ok) {
			router.push("/");
		} else {
			console.error("Sign in failed", result?.error);
		}
	}

	return (
		<div className="login">
			<form onSubmit={handleSubmit}>
				<label>
					Username
					<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
				</label>
				<label>
					Password
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</label>
				<button className="landingButton accent1" type="submit">
					Login
				</button>
			</form>
		</div>
	);
}
