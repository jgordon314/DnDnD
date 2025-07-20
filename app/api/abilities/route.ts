import conn from "@/app/lib/db";
import { NextResponse } from "next/server";
import { AbilityType } from "@/app/types";

// create new ability
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, description, type, ...skillDeltas } = body;

		if (!name || !description || !type) {
			return NextResponse.json({ error: "Missing required fields: name, description, or type" }, { status: 400 });
		}

		const validTypes: AbilityType[] = ["non-action", "action", "bonus-action", "reaction", "free-action"];
		if (!validTypes.includes(type as AbilityType)) {
			return NextResponse.json({ error: "Invalid ability type" }, { status: 400 });
		}

		await conn.beginTransaction();

		try {
			let skill_delta_id = null;
			if (Object.keys(skillDeltas).length > 0) {
				const columns = Object.keys(skillDeltas);
				const values = Object.values(skillDeltas);
				const placeholders = columns.map(() => "?").join(", ");
				const sql = `INSERT INTO SkillDeltas (${columns.join(", ")}) VALUES (${placeholders})`;
				const [result]: any = await conn.query(sql, values);
				skill_delta_id = result.insertId;
			}

			const validType = validTypes.includes(type as AbilityType) ? type : "action";

			const ability_result = await conn.query(
				"INSERT INTO Abilities (name, description, skill_delta_id, type) VALUES (?, ?, ?, ?)",
				[name, description, skill_delta_id || null, validType]
			);

			await conn.commit();
			return NextResponse.json({ success: true });
		} catch (error) {
			await conn.rollback();
			throw error;
		}
	} catch (error) {
		console.error("Error creating ability:", error);
		return NextResponse.json({ error: "Failed to create ability" }, { status: 500 });
	}
}

export async function GET() {
	try {
		const [abilities] = await conn.query(`
			SELECT sd.*, a.id, a.name, a.description, a.type, a.skill_delta_id
			FROM Abilities a
			LEFT JOIN SkillDeltas sd ON a.skill_delta_id = sd.id
		`);
		console.log("fetching abilities", abilities);
		return NextResponse.json(abilities);
	} catch (error) {
		console.error("Error fetching abilities:", error);
		return NextResponse.json({ error: "Failed to fetch abilities" }, { status: 500 });
	}
}
