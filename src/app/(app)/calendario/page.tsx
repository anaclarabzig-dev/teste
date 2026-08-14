import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import CalendarioClient from "./CalendarioClient";

export default async function CalendarioPage() {
  const session = await auth();
  const canEdit = canManage(session, "AGENCIA");

  const [atividades, newsletters, eventos, viagens] = await Promise.all([
    prisma.calendarActivity.findMany({ orderBy: [{ data: "asc" }, { hora: "asc" }] }),
    prisma.newsletter.findMany({ orderBy: { data: "asc" } }),
    prisma.industryEvent.findMany(),
    prisma.trip.findMany({ orderBy: { dataInicio: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Calendário da Agência</h1>
        <p className="text-sm text-neutral-500">
          Atividades, rodízio de newsletters, eventos do setor e viagens da equipe.
        </p>
      </div>
      <CalendarioClient
        atividades={atividades}
        newsletters={newsletters}
        eventos={eventos}
        viagens={viagens}
        canEdit={canEdit}
      />
    </div>
  );
}
