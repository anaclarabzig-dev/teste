import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AppShell
      userName={session.user.name ?? session.user.username ?? "Usuário"}
      userRole={session.user.role ?? "IMPRENSA"}
      userSetor={session.user.setor}
    >
      {children}
    </AppShell>
  );
}
