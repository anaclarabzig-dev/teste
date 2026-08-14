"use client";

import { useState } from "react";
import {
  createAgencyMember,
  deleteAgencyMember,
  createJournalismMember,
  deleteJournalismMember,
} from "./actions";

type AgencyMember = { id: string; nome: string; funcao: string | null; atividades: string };
type JournalismMember = { id: string; nome: string; cargo: string };

const TABS = ["Agência", "Jornalismo (Imprensa)"] as const;
const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none";
const btnClass = "rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800";

function DelBtn({ action, id }: { action: (fd: FormData) => void; id: string }) {
  return (
    <form action={action} onSubmit={(e) => { if (!confirm("Remover este item?")) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-800">Remover</button>
    </form>
  );
}

export default function EquipesClient({
  agencyMembers, journalismMembers, isAdmin,
}: { agencyMembers: AgencyMember[]; journalismMembers: JournalismMember[]; isAdmin: boolean }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Agência");

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-neutral-200">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${tab === t ? "border-b-2 border-neutral-900 text-neutral-900" : "text-neutral-500 hover:text-neutral-800"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Agência" && (
        <div className="space-y-4">
          {isAdmin && (
            <form action={createAgencyMember} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <input name="nome" placeholder="Nome" required className={inputClass} />
              <input name="funcao" placeholder="Função" className={inputClass} />
              <textarea name="atividades" placeholder="Atividades (uma por linha)" rows={2} className={`col-span-2 ${inputClass}`} />
              <button type="submit" className={`${btnClass} col-span-2`}>Adicionar</button>
            </form>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agencyMembers.map((m) => {
              const atividades: string[] = JSON.parse(m.atividades || "[]");
              return (
                <div key={m.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{m.nome}</p>
                      <p className="text-xs text-neutral-500">{m.funcao}</p>
                    </div>
                    {isAdmin && <DelBtn action={deleteAgencyMember} id={m.id} />}
                  </div>
                  {atividades.length > 0 && (
                    <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-neutral-600">
                      {atividades.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  )}
                </div>
              );
            })}
            {agencyMembers.length === 0 && <p className="text-sm text-neutral-400">Nenhum membro cadastrado.</p>}
          </div>
        </div>
      )}

      {tab === "Jornalismo (Imprensa)" && (
        <div className="space-y-4">
          {isAdmin && (
            <form action={createJournalismMember} className="flex flex-wrap gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <input name="nome" placeholder="Nome" required className={`flex-1 ${inputClass}`} />
              <select name="cargo" required className={inputClass} defaultValue="IMPRENSA">
                <option value="IMPRENSA">Imprensa</option>
                <option value="AGÊNCIA">Agência</option>
              </select>
              <button type="submit" className={btnClass}>Adicionar</button>
            </form>
          )}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr><th className="px-4 py-2">Nome</th><th className="px-4 py-2">Cargo</th><th className="px-4 py-2"></th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {journalismMembers.map((j) => (
                  <tr key={j.id}>
                    <td className="px-4 py-2">{j.nome}</td>
                    <td className="px-4 py-2">{j.cargo}</td>
                    <td className="px-4 py-2 text-right">{isAdmin && <DelBtn action={deleteJournalismMember} id={j.id} />}</td>
                  </tr>
                ))}
                {journalismMembers.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-neutral-400">Nenhum membro cadastrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
