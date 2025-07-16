"use server";

import { RowDataPacket } from "mysql2";
import conn from "../db";
import { Character, ID } from "../types";

export async function getCharactersForUser(userId: ID): Promise<Character[]> {
    const [rows] = await conn.query<(Character & RowDataPacket)[]>("SELECT * FROM Characters WHERE user_id = ?", [userId]);

    return rows;
}

export async function getCharacterByCharacterId(characterId: ID) {
    const [rows] = await conn.query<(Character & RowDataPacket)[]>("SELECT * FROM Characters WHERE id = ?", [characterId]);

    return rows[0];
}
