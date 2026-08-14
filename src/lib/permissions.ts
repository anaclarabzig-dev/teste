import { Session } from "next-auth";

export type Setor = "AGENCIA" | "IMPRENSA";

export function canManage(session: Session | null, setor: Setor): boolean {
  if (!session?.user) return false;
  if (session.user.role === "ADMIN") return true;
  return session.user.setor === setor;
}

export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "ADMIN";
}
