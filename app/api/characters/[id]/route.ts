import conn from "@/app/lib/db";
import { NextResponse } from "next/server";
import { errors } from "undici-types";

export async function GET(request: Request, { params }: { params: { id: string } }) {
	console.log("GET /api/characters/[id] params:", params);
	try {
		// Handle params directly without awaiting for consistency
		const id = params.id;
		console.log("Querying characters for user_id:", id);
		const [rows] = await conn.query("SELECT * FROM Characters WHERE user_id = ?", [Number(id)]);
		console.log("Character query result:", rows);
		return NextResponse.json(rows);
	} catch (error) {
		console.error("Error fetching characters:", error);
		return NextResponse.json({ error: "Failed to fetch characters" }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const { id } = await params;
	try {
		await conn.query("DELETE FROM Characters WHERE id = ?", [Number(id)]);
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return NextResponse.error();
	}
}
