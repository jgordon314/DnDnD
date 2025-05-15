import conn from "@/app/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
	try {
		const [rows] = await conn.query("SELECT * FROM characters");
		return NextResponse.json(rows);
	} catch (error) {
		return NextResponse.error();
	}
}

export async function POST(request: Request) {
	try {
		const { name, health } = await request.json();

		await conn.query("INSERT INTO characters (name, health) VALUES (?, ?)", [name, health]);
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.error;
	}
}
