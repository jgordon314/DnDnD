import { RowDataPacket } from "mysql2";
import { Ability, Item } from "../../types";
import conn from "../../db";

export async function getAbilitiesForEveryone(): Promise<Ability[]> {
    const [rows] = await conn.query<(Ability & RowDataPacket)[]>("SELECT * FROM Abilities");

    return rows;
}

