import conn from "@/app/lib/db";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, player_id, ...skillDeltas } = body;
		if (!name || !player_id) {
			return NextResponse.json(
				{ error: "Missing name or player_id" },
				{ status: 400 }
			);
		}
		const user_id = player_id; // use player_id from frontend/session
		const description = "Empty.";

		// Insert a new SkillDeltas row with all provided values
		const columns = Object.keys(skillDeltas);
		const values = Object.values(skillDeltas);
		const placeholders = columns.map(() => "?").join(", ");
		const sql = `INSERT INTO SkillDeltas (${columns.join(
			", "
		)}) VALUES (${placeholders})`;
		const [result]: any = await conn.query(sql, values);
		const base_stat_id = result.insertId;

		await conn.query(
			"INSERT INTO Characters (name, description, user_id, base_stat_id) VALUES (?, ?, ?, ?)",
			[name, description, user_id, base_stat_id]
		);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("POST /api/characters error:", error);
		return NextResponse.error();
	}
}
