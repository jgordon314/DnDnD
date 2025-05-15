import conn from "@/app/lib/db";
import { NextResponse } from "next/server";
import { errors } from "undici-types";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const { id } = await params;
	try {
		await conn.query("DELETE FROM characters WHERE id = ?", [id]);
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return NextResponse.error();
	}
}
