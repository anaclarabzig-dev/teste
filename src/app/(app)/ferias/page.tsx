import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import FeriasClient from "./FeriasClient";

export default async function FeriasPage() {
  const session = await auth();
  const vacations = await prisma.vacation.findMany();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Férias</h1>
        <p className="text-sm text-neutral-500">
          Controle de férias das equipes de Imprensa e Agência.
        </p>
      </div>
      <FeriasClient
        vacations={vacations}
        canEditAgencia={canManage(session, "AGENCIA")}
        canEditImprensa={canManage(session, "IMPRENSA")}
      />
    </div>
  );
}
