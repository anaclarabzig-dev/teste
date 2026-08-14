import { prisma } from "@/lib/prisma";
import { format, addDays } from "date-fns";
import Link from "next/link";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function Card({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h3>
      {children}
    </Link>
  );
}

export default async function DashboardPage() {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const in14 = format(addDays(today, 14), "yyyy-MM-dd");
  const mesAtual = MESES[today.getMonth()];

  const [proximasAtividades, feriasAtivas, proximasFerias, statsMes, totalAtividades] =
    await Promise.all([
      prisma.calendarActivity.findMany({
        where: { data: { gte: todayStr, lte: in14 } },
        orderBy: [{ data: "asc" }, { hora: "asc" }],
        take: 6,
      }),
      prisma.vacation.findMany({
        where: { dataInicio: { lte: todayStr }, dataFim: { gte: todayStr } },
      }),
      prisma.vacation.findMany({
        where: { dataInicio: { gte: todayStr, lte: in14 } },
        orderBy: { dataInicio: "asc" },
        take: 6,
      }),
      prisma.textProductionStat.findMany({ where: { mes: mesAtual } }),
      prisma.calendarActivity.count(),
    ]);

  const totalTextosMes = statsMes.reduce((acc, s) => acc + s.quantidade, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Painel geral</h1>
        <p className="text-sm text-neutral-500">
          Resumo das atividades, férias e produção de conteúdo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-neutral-500">Atividades cadastradas</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">{totalAtividades}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-neutral-500">Em férias agora</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">{feriasAtivas.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-neutral-500">Textos produzidos ({mesAtual})</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">{totalTextosMes}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-neutral-500">Próximas férias (14 dias)</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">{proximasFerias.length}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Próximas atividades" href="/calendario">
          {proximasAtividades.length === 0 ? (
            <p className="text-sm text-neutral-400">Nenhuma atividade nos próximos 14 dias.</p>
          ) : (
            <ul className="space-y-2">
              {proximasAtividades.map((a) => (
                <li key={a.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-neutral-800">{a.nome}</span>
                  <span className="ml-2 shrink-0 text-neutral-500">
                    {a.data.slice(5)} {a.hora ? `· ${a.hora}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Quem está de férias agora" href="/ferias">
          {feriasAtivas.length === 0 ? (
            <p className="text-sm text-neutral-400">Ninguém de férias no momento.</p>
          ) : (
            <ul className="space-y-2">
              {feriasAtivas.map((f) => (
                <li key={f.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-800">{f.nome}</span>
                  <span className="text-neutral-500">até {f.dataFim.slice(5)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Férias chegando" href="/ferias">
          {proximasFerias.length === 0 ? (
            <p className="text-sm text-neutral-400">Nenhuma férias nos próximos 14 dias.</p>
          ) : (
            <ul className="space-y-2">
              {proximasFerias.map((f) => (
                <li key={f.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-800">{f.nome}</span>
                  <span className="text-neutral-500">a partir de {f.dataInicio.slice(5)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Produção de textos do mês" href="/producao-textos">
          {statsMes.length === 0 ? (
            <p className="text-sm text-neutral-400">Sem dados para {mesAtual}.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {["CNI", "SENAI", "SESI", "IEL"].map((org) => {
                const total = statsMes
                  .filter((s) => s.org === org)
                  .reduce((acc, s) => acc + s.quantidade, 0);
                return (
                  <li key={org} className="flex items-center justify-between">
                    <span className="text-neutral-800">{org}</span>
                    <span className="text-neutral-500">{total} itens</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
