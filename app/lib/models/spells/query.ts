import { RowDataPacket } from "mysql2";
import { Spell } from "../../types";
import conn from "../../db";

export async function getSpellsForEveryone(): Promise<Spell[]> {
    const [rows] = await conn.query<(Spell & RowDataPacket)[]>("SELECT * FROM Spells");

    return rows;
}

