"use server"

import { createUserWithUsernamePassword } from "@/app/lib/models/users/query"

export async function signUp(username: string, password: string) {
    if (!username || !password) {
        return "Both username and password must be non-empty"
    };

    if (typeof username !== "string" || typeof password !== "string") {
        return "Both username and password must be strings"
    };

    try {
        await createUserWithUsernamePassword(username, password);
    } catch (e) {
        return String(e);
    }

    return "";
}
