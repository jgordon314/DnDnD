import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import conn from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next/types";

interface DbUser extends RowDataPacket {
	id: number;
	username: string;
	password: string;
}

const authConfig = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text", placeholder: "Username" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					if (!credentials?.username || !credentials?.password) return null;

					const [rows] = await conn.query<DbUser[]>(
						"SELECT id, username, password FROM Users WHERE username = ?",
						[credentials.username]
					);

					console.log(rows);

					const user = rows[0];
					if (!user) return null;

					if (credentials.password !== user.password) return null;

					console.log("logging in", user.username);
					return {
						id: String(user.id),
						name: user.username,
					};
				} catch (error) {
					console.error("Auth error:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token, user }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
			}
			return token;
		},
	},
	session: { strategy: "jwt" },
	pages: { signIn: "/login" },
} satisfies NextAuthOptions

const handler = NextAuth(authConfig);

function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig)
}

export {
	handler as GET,
	handler as POST,
	auth
};
