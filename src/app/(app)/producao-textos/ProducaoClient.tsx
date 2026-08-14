"use client";

import { useMemo, useState } from "react";
import { updateStat, createItem, deleteItem } from "./actions";

type Stat = { id: string; mes: string; categoria: string; org: string; quantidade: number; tema: string };
type Item = { id: string; mes: string; categoria: string; org: string; assunto: string; numero: string | null };

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const ORGS = ["CNI", "SENAI", "SESI", "IEL"];
const CATEGORIAS = [
  { key: "releases", label: "Releases" },
  { key: "avisos", label: "Avisos de Pauta" },
  { key: "posicionamentos", label: "Posicionamentos" },
  { key: "notas", label: "Notas" },
  { key: "artigos", label: "Artigos" },
  { key: "briefings", label: "Briefings" },
  { key: "entrevistas", label: "Entrevistas" },
];

const inputClass =
  "w-full rounded-md border border-neutral-300 px-2 py-1 text-xs focus:border-neutral-500 focus:outline-none";
const btnClass =
  "rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800";

function StatCell({ stat, mes, categoria, org, canEdit }: { stat?: Stat; mes: string; categoria: string; org: string; canEdit: boolean }) {
  if (!canEdit) {
    return (
      <div className="space-y-1 p-2">
        <p className="text-sm font-semibold text-neutral-900">{stat?.quantidade ?? 0}</p>
        {stat?.tema && <p className="whitespace-pre-line text-xs text-neutral-500">{stat.tema}</p>}
      </div>
    );
  }
  return (
    <form action={updateStat} className="space-y-1 p-2">
      <input type="hidden" name="mes" value={mes} />
      <input type="hidden" name="categoria" value={categoria} />
      <input type="hidden" name="org" value={org} />
      <input
        type="number"
        name="quantidade"
        min={0}
        defaultValue={stat?.quantidade ?? 0}
        className={`${inputClass} w-16`}
      />
      <textarea
        name="tema"
        defaultValue={stat?.tema ?? ""}
        placeholder="Temas..."
        rows={2}
        className={`${inputClass} w-full resize-none`}
      />
      <button type="submit" className="text-[10px] font-medium text-neutral-600 hover:text-neutral-900">
        Salvar
      </button>
    </form>
  );
}

export default function ProducaoClient({
  stats,
  items,
  canEdit,
}: {
  stats: Stat[];
  items: Item[];
  canEdit: boolean;
}) {
  const currentMonth = MESES[new Date().getMonth()];
  const [mes, setMes] = useState(currentMonth);

  const statsMes = useMemo(() => stats.filter((s) => s.mes === mes), [stats, mes]);
  const itemsMes = useMemo(() => items.filter((i) => i.mes === mes), [items, mes]);

  const statFor = (categoria: string, org: string) =>
    statsMes.find((s) => s.categoria === categoria && s.org === org);

  const totalMes = statsMes.reduce((acc, s) => acc + s.quantidade, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
        >
          {MESES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <p className="text-sm text-neutral-500">
          Total de itens em {mes}: <span className="font-semibold text-neutral-900">{totalMes}</span>
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="border-b border-neutral-200 px-3 py-2">Categoria</th>
              {ORGS.map((org) => (
                <th key={org} className="border-b border-l border-neutral-200 px-3 py-2">{org}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIAS.map((cat) => (
              <tr key={cat.key} className="border-b border-neutral-100 align-top">
                <td className="px-3 py-2 text-sm font-medium text-neutral-800">{cat.label}</td>
                {ORGS.map((org) => (
                  <td key={org} className="border-l border-neutral-100">
                    <StatCell stat={statFor(cat.key, org)} mes={mes} categoria={cat.key} org={org} canEdit={canEdit} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-900">Itens cadastrados em {mes}</h3>
        {canEdit && (
          <form action={createItem} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-6">
            <input type="hidden" name="mes" value={mes} />
            <select name="categoria" required className={`${inputClass} sm:col-span-1`} defaultValue="releases">
              {CATEGORIAS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <select name="org" required className={`${inputClass} sm:col-span-1`} defaultValue="CNI">
              {ORGS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <input name="assunto" placeholder="Assunto" required className={`col-span-2 ${inputClass}`} />
            <input name="numero" placeholder="Nº" className={inputClass} />
            <button type="submit" className={`${btnClass} col-span-2 sm:col-span-1`}>Adicionar</button>
          </form>
        )}
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-2">Categoria</th>
                <th className="px-4 py-2">Org</th>
                <th className="px-4 py-2">Assunto</th>
                <th className="px-4 py-2">Nº</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {itemsMes.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2">{CATEGORIAS.find((c) => c.key === i.categoria)?.label ?? i.categoria}</td>
                  <td className="px-4 py-2">{i.org}</td>
                  <td className="px-4 py-2">{i.assunto}</td>
                  <td className="px-4 py-2">{i.numero || "-"}</td>
                  <td className="px-4 py-2 text-right">
                    {canEdit && (
                      <form action={deleteItem}>
                        <input type="hidden" name="id" value={i.id} />
                        <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-800">
                          Remover
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {itemsMes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                    Nenhum item cadastrado neste mês.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
