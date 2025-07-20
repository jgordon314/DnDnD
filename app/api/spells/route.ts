import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, level, description, duration, casting_time, spell_range, components, ...skillDeltas } = body;

		if (!name || !description) {
			return NextResponse.json({ error: "Missing required fields: name or description" }, { status: 400 });
		}

		console.log("Creating spell with data:", {
			name,
			level,
			description: description.substring(0, 50) + "...",
			duration,
			casting_time,
			spell_range,
			components,
			skillDeltasKeys: Object.keys(skillDeltas),
		});

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

			await conn.query(
				"INSERT INTO Spells (name, level, description, duration, skill_delta_id, casting_time, spellRange, components) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
				[
					name,
					level || 0,
					description,
					duration || 0,
					skill_delta_id,
					casting_time || "Action",
					spell_range || "Self",
					components || "V, S",
				]
			);

			await conn.commit();
			return NextResponse.json({ success: true });
		} catch (error) {
			await conn.rollback();
			throw error;
		}
	} catch (error) {
		console.error("Error creating spell:", error);
		return NextResponse.json({ error: "Failed to create spell" }, { status: 500 });
	}
}

export async function GET() {
	try {
		const [spells] = await conn.query(`
			SELECT s.*, sd.*
			FROM Spells s
			LEFT JOIN SkillDeltas sd ON s.skill_delta_id = sd.id
		`);
		return NextResponse.json(spells);
	} catch (error) {
		console.error("Error fetching spells:", error);
		return NextResponse.json({ error: "Failed to fetch spells" }, { status: 500 });
	}
}
