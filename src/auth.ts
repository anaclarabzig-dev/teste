import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;

        const user = await prisma.user.findUnique({
          where: { username: username.trim().toLowerCase() },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          setor: user.setor ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as unknown as { role: string }).role;
        token.setor = (user as unknown as { setor?: string }).setor;
        token.username = (user as unknown as { username: string }).username;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as unknown as { role?: string; setor?: string; username?: string }).role =
          token.role as string | undefined;
        (session.user as unknown as { role?: string; setor?: string; username?: string }).setor =
          token.setor as string | undefined;
        (session.user as unknown as { role?: string; setor?: string; username?: string }).username =
          token.username as string | undefined;
      }
      return session;
    },
  },
});
