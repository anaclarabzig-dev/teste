"use client";

import { useState } from "react";
import {
  createPressMember,
  deletePressMember,
  createSpokesperson,
  deleteSpokesperson,
  createRelationship,
  deleteRelationship,
} from "./actions";

type PressMember = { id: string; nome: string; ramal: string | null; area: string | null; atividades: string | null };
type Spokesperson = { id: string; nome: string; area: string | null; agenda: string | null };
type Relationship = {
  id: string; data: string; portaVoz: string; nome: string;
  temaSugerido: string | null; jornalistaVeiculo: string | null;
};

const TABS = ["Equipe", "Porta-vozes", "Agenda de Relacionamento"] as const;
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

export default function ImprensaClient({
  pressTeam, spokespersons, relationshipAgenda, canEdit,
}: {
  pressTeam: PressMember[]; spokespersons: Spokesperson[]; relationshipAgenda: Relationship[]; canEdit: boolean;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Equipe");

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

      {tab === "Equipe" && (
        <div className="space-y-4">
          {canEdit && (
            <form action={createPressMember} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-4">
              <input name="nome" placeholder="Nome" required className={inputClass} />
              <input name="ramal" placeholder="Ramal" className={inputClass} />
              <input name="area" placeholder="Área" className={inputClass} />
              <textarea name="atividades" placeholder="Atividades atuais" rows={1} className={`col-span-2 ${inputClass} sm:col-span-4`} />
              <button type="submit" className={`${btnClass} col-span-2 sm:col-span-4`}>Adicionar</button>
            </form>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {pressTeam.map((p) => (
              <div key={p.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{p.nome}</p>
                    <p className="text-xs text-neutral-500">{p.area}{p.ramal ? ` · ramal ${p.ramal}` : ""}</p>
                  </div>
                  {canEdit && <DelBtn action={deletePressMember} id={p.id} />}
                </div>
                {p.atividades && <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">{p.atividades}</p>}
              </div>
            ))}
            {pressTeam.length === 0 && <p className="text-sm text-neutral-400">Nenhum membro cadastrado.</p>}
          </div>
        </div>
      )}

      {tab === "Porta-vozes" && (
        <div className="space-y-4">
          {canEdit && (
            <form action={createSpokesperson} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-4">
              <input name="nome" placeholder="Nome" required className={inputClass} />
              <input name="area" placeholder="Área" className={`col-span-2 ${inputClass} sm:col-span-2`} />
              <input name="agenda" placeholder="Agenda" className={inputClass} />
              <button type="submit" className={`${btnClass} col-span-2 sm:col-span-4`}>Adicionar</button>
            </form>
          )}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr><th className="px-4 py-2">Nome</th><th className="px-4 py-2">Área</th><th className="px-4 py-2">Agenda</th><th className="px-4 py-2"></th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {spokespersons.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2">{s.nome}</td>
                    <td className="px-4 py-2">{s.area}</td>
                    <td className="px-4 py-2">{s.agenda || "-"}</td>
                    <td className="px-4 py-2 text-right">{canEdit && <DelBtn action={deleteSpokesperson} id={s.id} />}</td>
                  </tr>
                ))}
                {spokespersons.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-neutral-400">Nenhum porta-voz cadastrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Agenda de Relacionamento" && (
        <div className="space-y-4">
          {canEdit && (
            <form action={createRelationship} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-6">
              <input name="data" type="date" required className={inputClass} />
              <input name="nome" placeholder="Executivo(a) CNI" required className={inputClass} />
              <input name="portaVoz" placeholder="Porta-voz" className={inputClass} />
              <input name="jornalistaVeiculo" placeholder="Jornalista / Veículo" className={inputClass} />
              <input name="temaSugerido" placeholder="Tema sugerido" className={`col-span-2 ${inputClass} sm:col-span-2`} />
              <button type="submit" className={`${btnClass} col-span-2 sm:col-span-6`}>Adicionar</button>
            </form>
          )}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-2">Data</th><th className="px-4 py-2">Nome</th><th className="px-4 py-2">Porta-voz</th>
                  <th className="px-4 py-2">Jornalista/Veículo</th><th className="px-4 py-2">Tema sugerido</th><th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {relationshipAgenda
                  .slice()
                  .sort((a, b) => a.data.localeCompare(b.data))
                  .map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{r.data}</td>
                    <td className="px-4 py-2">{r.nome}</td>
                    <td className="px-4 py-2">{r.portaVoz}</td>
                    <td className="px-4 py-2">{r.jornalistaVeiculo}</td>
                    <td className="px-4 py-2">{r.temaSugerido}</td>
                    <td className="px-4 py-2 text-right">{canEdit && <DelBtn action={deleteRelationship} id={r.id} />}</td>
                  </tr>
                ))}
                {relationshipAgenda.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-neutral-400">Nenhum registro.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
