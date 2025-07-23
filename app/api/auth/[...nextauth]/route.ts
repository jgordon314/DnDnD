import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import conn from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next/types";
import { getUserByUserId, getUserByUsername } from "@/app/lib/models/users/query";

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
				if (!credentials?.username || !credentials?.password) return null;

				const user = await getUserByUsername(credentials?.username)
				if (!user) return null;

				if (credentials.password !== user.password) return null;

				return {
					id: String(user.id),
					username: user.username,
				};
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (session.user && token.sub) {
				const user = await getUserByUserId(token.sub);
				session.user.id = parseInt(token.sub);
				session.user.username = user?.username || "";
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
