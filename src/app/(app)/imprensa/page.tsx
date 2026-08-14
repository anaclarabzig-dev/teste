import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import ImprensaClient from "./ImprensaClient";

export default async function ImprensaPage() {
  const session = await auth();
  const [pressTeam, spokespersons, relationshipAgenda] = await Promise.all([
    prisma.pressTeamMember.findMany({ orderBy: { nome: "asc" } }),
    prisma.spokesperson.findMany({ orderBy: { nome: "asc" } }),
    prisma.relationshipAgenda.findMany(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Imprensa</h1>
        <p className="text-sm text-neutral-500">
          Equipe de imprensa, porta-vozes e agenda de relacionamento com jornalistas.
        </p>
      </div>
      <ImprensaClient
        pressTeam={pressTeam}
        spokespersons={spokespersons}
        relationshipAgenda={relationshipAgenda}
        canEdit={canManage(session, "IMPRENSA")}
      />
    </div>
  );
}
