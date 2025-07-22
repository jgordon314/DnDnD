import { RowDataPacket } from "mysql2";
import { ID, Item } from "../../types";
import conn from "../../db";

export async function getItemsForEveryone(): Promise<Item[]> {
    const [rows] = await conn.query<(Item & RowDataPacket)[]>("SELECT * FROM Items");

    return rows;
}

