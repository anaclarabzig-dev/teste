import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import ProducaoClient from "./ProducaoClient";

export default async function ProducaoTextosPage() {
  const session = await auth();
  const [stats, items] = await Promise.all([
    prisma.textProductionStat.findMany(),
    prisma.textProductionItem.findMany(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Produção de Textos</h1>
        <p className="text-sm text-neutral-500">
          Releases, avisos, posicionamentos, notas, artigos, briefings e entrevistas por organização.
        </p>
      </div>
      <ProducaoClient stats={stats} items={items} canEdit={canManage(session, "IMPRENSA")} />
    </div>
  );
}
