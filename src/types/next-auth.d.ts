import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      setor?: string;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    setor?: string;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    setor?: string;
    username?: string;
  }
}
