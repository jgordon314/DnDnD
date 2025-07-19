import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, description, ability_id } = body;

		if (!name || !description) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		try {
			await conn.query("INSERT INTO Items (name, description, ability_id) VALUES (?, ?, ?)", [
				name,
				description,
				ability_id || null,
			]);

			return NextResponse.json({ success: true });
		} catch (error) {
			throw error;
		}
	} catch (error) {
		console.error("Error creating item:", error);
		return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
	}
}

export async function GET() {
	try {
		const [items] = await conn.query(`
			SELECT i.*, a.name as ability_name, a.description as ability_description
			FROM Items i
			LEFT JOIN Abilities a ON i.ability_id = a.id
		`);
		return NextResponse.json(items);
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
