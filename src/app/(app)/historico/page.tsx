import { prisma } from "@/lib/prisma";

export default async function HistoricoPage() {
  const changes = await prisma.changeLog.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Histórico de Alterações</h1>
        <p className="text-sm text-neutral-500">Registro de itens removidos do sistema.</p>
      </div>
      <div className="space-y-3">
        {changes.map((c) => {
          let item: Record<string, unknown> = {};
          try {
            item = JSON.parse(c.deletedItem);
          } catch {
            // ignore malformed legacy entries
          }
          return (
            <div key={c.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-neutral-900">{c.description}</p>
              <p className="text-xs text-neutral-500">
                {c.collectionPath} {c.timestamp && `· ${c.timestamp}`}
              </p>
              {item?.nome ? (
                <p className="mt-1 text-sm text-neutral-600">{String(item.nome)}</p>
              ) : null}
            </div>
          );
        })}
        {changes.length === 0 && <p className="text-sm text-neutral-400">Nenhuma alteração registrada.</p>}
      </div>
    </div>
  );
}
