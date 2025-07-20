import conn from "@/app/lib/db";
import { NextResponse } from "next/server";
import { errors } from "undici-types";

export async function GET(request: Request, { params }: { params: { id: string } }) {
	console.log("GET /api/characters/[id] params:", params);
	try {
		const id = params.id;
		const [rows] = await conn.query("SELECT * FROM Characters WHERE user_id = ?", [Number(id)]);
		return NextResponse.json(rows);
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch characters" }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const { id } = params;
	try {
		await conn.query("DELETE FROM Characters WHERE id = ?", [Number(id)]);
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return NextResponse.error();
	}
}
