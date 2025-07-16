import { RowDataPacket } from "mysql2";
import conn from "../db";
import { ID, User } from "../types";

export async function getUserByUsername(username: string) {
    const [rows] = await conn.query<(User & RowDataPacket)[]>(
        "SELECT id, username, password FROM Users WHERE username = ?",
        [username]
    );

    if (!rows) return null;

    return rows[0];
}

export async function getUserByUserId(userId: ID) {
    const [rows] = await conn.query<(User & RowDataPacket)[]>(
        "SELECT id, username, password FROM Users WHERE id = ?",
        [userId]
    );

    if (!rows) return null;

    return rows[0];
}
