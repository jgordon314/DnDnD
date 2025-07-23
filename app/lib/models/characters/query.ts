"use server";

import { ResultSetHeader, RowDataPacket } from "mysql2";
import conn from "../../db";
import { Character, ID } from "../../types";

export async function getCharactersForUser(userId: ID): Promise<Character[]> {
    const [rows] = await conn.query<(Character & RowDataPacket)[]>("SELECT * FROM Characters WHERE user_id = ?", [userId]);

    return rows;
}

export async function getCharacterByCharacterId(characterId: ID) {
    const [rows] = await conn.query<(Character & RowDataPacket)[]>("SELECT * FROM Characters WHERE id = ?", [characterId]);

    return rows[0];
}

export async function deleteCharacterByCharacterId(characterId: ID) {
    const [result, field] = await conn.query<ResultSetHeader>("DELETE FROM Characters WHERE id = ?", [characterId]);

    return result.affectedRows === 1
}
