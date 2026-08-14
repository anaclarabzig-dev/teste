"use client";

import { useMemo, useState } from "react";
import { createFerias, deleteFerias } from "./actions";

type Vacation = { id: string; nome: string; setor: string; dataInicio: string; dataFim: string };

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none";
const btnClass =
  "rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800";

function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteFerias}
      onSubmit={(e) => {
        if (!confirm("Remover estas férias?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-800">
        Remover
      </button>
    </form>
  );
}

export default function FeriasClient({
  vacations,
  canEditAgencia,
  canEditImprensa,
}: {
  vacations: Vacation[];
  canEditAgencia: boolean;
  canEditImprensa: boolean;
}) {
  const [filtro, setFiltro] = useState<"TODOS" | "AGENCIA" | "IMPRENSA">("TODOS");
  const todayStr = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(
    () => vacations.filter((v) => filtro === "TODOS" || v.setor === filtro),
    [vacations, filtro]
  );

  const canAddAny = canEditAgencia || canEditImprensa;

  return (
    <div className="space-y-6">
      {canAddAny && (
        <form action={createFerias} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-5">
          <input name="nome" placeholder="Nome" required className={`col-span-2 ${inputClass}`} />
          <select name="setor" required className={inputClass} defaultValue="">
            <option value="" disabled>Setor</option>
            {canEditImprensa && <option value="IMPRENSA">Imprensa</option>}
            {canEditAgencia && <option value="AGENCIA">Agência</option>}
          </select>
          <input name="dataInicio" type="date" required className={inputClass} />
          <input name="dataFim" type="date" required className={inputClass} />
          <button type="submit" className={`${btnClass} col-span-2 sm:col-span-5`}>
            Adicionar férias
          </button>
        </form>
      )}

      <div className="flex gap-1">
        {(["TODOS", "IMPRENSA", "AGENCIA"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              filtro === f ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {f === "TODOS" ? "Todos" : f === "IMPRENSA" ? "Imprensa" : "Agência"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Setor</th>
              <th className="px-4 py-2">Início</th>
              <th className="px-4 py-2">Fim</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered
              .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
              .map((v) => {
                const ativo = v.dataInicio <= todayStr && v.dataFim >= todayStr;
                const futuro = v.dataInicio > todayStr;
                const canDelete = v.setor === "AGENCIA" ? canEditAgencia : canEditImprensa;
                return (
                  <tr key={v.id}>
                    <td className="px-4 py-2">{v.nome}</td>
                    <td className="px-4 py-2 capitalize">{v.setor === "AGENCIA" ? "Agência" : "Imprensa"}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{v.dataInicio}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{v.dataFim}</td>
                    <td className="px-4 py-2">
                      {ativo ? (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                          em férias
                        </span>
                      ) : futuro ? (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                          agendada
                        </span>
                      ) : (
                        <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                          concluída
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">{canDelete && <DeleteButton id={v.id} />}</td>
                  </tr>
                );
              })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  Nenhum registro de férias.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
