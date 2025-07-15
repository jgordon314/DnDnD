import conn from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string, spell_id: string } }) {
	const { id, spell_id } = await params;
	try {
        const activateSpellSQL = `
        UPDATE CharacterSpellList csi SET activations =
        activations + 1 WHERE csi.spell_id = ? AND csi.character_id = ?
        `
        const [rows] = await conn.query(activateSpellSQL, [Number(spell_id), Number(id)])
        console.log(rows);
        return NextResponse.json(rows);
	} catch (error) {
        console.log(error);
		return NextResponse.error();
	}
}