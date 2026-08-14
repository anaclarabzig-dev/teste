import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/permissions";
import EquipesClient from "./EquipesClient";

export default async function EquipesPage() {
  const session = await auth();
  const [agencyMembers, journalismMembers] = await Promise.all([
    prisma.agencyMember.findMany({ orderBy: { nome: "asc" } }),
    prisma.journalismTeamMember.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Equipes</h1>
        <p className="text-sm text-neutral-500">Membros das equipes de Agência e Jornalismo/Imprensa.</p>
      </div>
      <EquipesClient
        agencyMembers={agencyMembers}
        journalismMembers={journalismMembers}
        isAdmin={isAdmin(session)}
      />
    </div>
  );
}
