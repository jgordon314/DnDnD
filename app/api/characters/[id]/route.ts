import conn from "@/app/lib/db";
import { NextResponse } from "next/server";
import { errors } from "undici-types";

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const { id } = params;
	try {
		const [rows] = await conn.query("SELECT * FROM characters WHERE user_id = ?", [Number(id)]);
		return NextResponse.json(rows);
	} catch (error) {
		return NextResponse.error();
	}
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const { id } = params;
	try {
		await conn.query("DELETE FROM characters WHERE id = ?", [Number(id)]);
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return NextResponse.error();
	}
}
