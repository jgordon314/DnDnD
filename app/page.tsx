import { auth } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
	const session = await auth();

	if (session) {
		redirect("/characters");
	} else {
		redirect("/auth/login");
	}
}
