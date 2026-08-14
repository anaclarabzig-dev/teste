"use client";

import { useState } from "react";
import {
  createAtividade,
  deleteAtividade,
  createNewsletter,
  deleteNewsletter,
  createEvento,
  deleteEvento,
  createViagem,
  deleteViagem,
} from "./actions";

type Atividade = {
  id: string;
  nome: string;
  data: string;
  hora: string | null;
  categoria: string;
  aDefinir: boolean;
  isNews: boolean;
};
type NewsletterItem = { id: string; data: string; responsavel: string };
type Evento = { id: string; titulo: string; periodo: string | null; mes: string | null };
type Viagem = {
  id: string;
  evento: string;
  nome: string;
  local: string;
  dataInicio: string;
  dataFim: string;
};

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const TABS = ["Atividades", "Newsletters", "Eventos", "Viagens"] as const;

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none";
const btnClass =
  "rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800";
const delBtnClass = "text-xs font-medium text-red-600 hover:text-red-800";

function DeleteButton({ action, id, label = "Remover" }: { action: (fd: FormData) => void; id: string; label?: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Remover este item?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={delBtnClass}>
        {label}
      </button>
    </form>
  );
}

export default function CalendarioClient({
  atividades,
  newsletters,
  eventos,
  viagens,
  canEdit,
}: {
  atividades: Atividade[];
  newsletters: NewsletterItem[];
  eventos: Evento[];
  viagens: Viagem[];
  canEdit: boolean;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Atividades");

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-neutral-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Atividades" && (
        <div className="space-y-4">
          {canEdit && (
            <form
              action={createAtividade}
              className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-6"
            >
              <input name="nome" placeholder="Nome da atividade" required className={`col-span-2 ${inputClass} sm:col-span-2`} />
              <input name="data" type="date" required className={inputClass} />
              <input name="hora" type="time" className={inputClass} />
              <select name="categoria" className={inputClass} defaultValue="publicacao">
                <option value="publicacao">Publicação</option>
                <option value="reuniao">Reunião</option>
                <option value="evento">Evento</option>
                <option value="outro">Outro</option>
              </select>
              <div className="col-span-2 flex items-center gap-3 text-xs text-neutral-600 sm:col-span-1">
                <label className="flex items-center gap-1">
                  <input type="checkbox" name="aDefinir" /> A definir
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" name="isNews" /> Notícia
                </label>
              </div>
              <button type="submit" className={`${btnClass} col-span-2 sm:col-span-6`}>
                Adicionar atividade
              </button>
            </form>
          )}

          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Hora</th>
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">Categoria</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {atividades.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{a.data}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{a.aDefinir ? "A definir" : a.hora || "-"}</td>
                    <td className="px-4 py-2">
                      {a.nome} {a.isNews && <span className="ml-1 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">notícia</span>}
                    </td>
                    <td className="px-4 py-2 capitalize">{a.categoria}</td>
                    <td className="px-4 py-2 text-right">
                      {canEdit && <DeleteButton action={deleteAtividade} id={a.id} />}
                    </td>
                  </tr>
                ))}
                {atividades.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                      Nenhuma atividade cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Newsletters" && (
        <div className="space-y-4">
          {canEdit && (
            <form action={createNewsletter} className="flex flex-wrap gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <input name="data" type="date" required className={inputClass} />
              <input name="responsavel" placeholder="Responsável" required className={`flex-1 ${inputClass}`} />
              <button type="submit" className={btnClass}>Definir</button>
            </form>
          )}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Responsável</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {newsletters.map((n) => (
                  <tr key={n.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{n.data}</td>
                    <td className="px-4 py-2">{n.responsavel}</td>
                    <td className="px-4 py-2 text-right">
                      {canEdit && <DeleteButton action={deleteNewsletter} id={n.id} />}
                    </td>
                  </tr>
                ))}
                {newsletters.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-neutral-400">
                      Nenhuma newsletter agendada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Eventos" && (
        <div className="space-y-4">
          {canEdit && (
            <form action={createEvento} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-5">
              <input name="titulo" placeholder="Título do evento" required className={`col-span-2 ${inputClass}`} />
              <input name="periodo" placeholder="Período (ex: 05 a 08)" className={inputClass} />
              <select name="mes" className={inputClass} defaultValue="">
                <option value="">Sem mês</option>
                {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <button type="submit" className={btnClass}>Adicionar evento</button>
            </form>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MESES.map((mes) => {
              const list = eventos.filter((e) => e.mes === mes);
              if (list.length === 0) return null;
              return (
                <div key={mes} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <h4 className="mb-2 text-sm font-semibold text-neutral-900">{mes}</h4>
                  <ul className="space-y-2">
                    {list.map((e) => (
                      <li key={e.id} className="flex items-start justify-between text-sm">
                        <div>
                          <p className="text-neutral-800">{e.titulo}</p>
                          {e.periodo && <p className="text-xs text-neutral-500">{e.periodo}</p>}
                        </div>
                        {canEdit && <DeleteButton action={deleteEvento} id={e.id} label="x" />}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {eventos.filter((e) => !e.mes).length > 0 && (
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <h4 className="mb-2 text-sm font-semibold text-neutral-900">Sem mês definido</h4>
                <ul className="space-y-2">
                  {eventos.filter((e) => !e.mes).map((e) => (
                    <li key={e.id} className="flex items-start justify-between text-sm">
                      <div>
                        <p className="text-neutral-800">{e.titulo}</p>
                        {e.periodo && <p className="text-xs text-neutral-500">{e.periodo}</p>}
                      </div>
                      {canEdit && <DeleteButton action={deleteEvento} id={e.id} label="x" />}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "Viagens" && (
        <div className="space-y-4">
          {canEdit && (
            <form action={createViagem} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-6">
              <input name="evento" placeholder="Evento" required className={`col-span-2 ${inputClass}`} />
              <input name="nome" placeholder="Nome(s)" required className={inputClass} />
              <input name="local" placeholder="Local" className={inputClass} />
              <input name="dataInicio" type="date" required className={inputClass} />
              <input name="dataFim" type="date" required className={inputClass} />
              <button type="submit" className={`${btnClass} col-span-2 sm:col-span-6`}>Adicionar viagem</button>
            </form>
          )}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-2">Evento</th>
                  <th className="px-4 py-2">Nome(s)</th>
                  <th className="px-4 py-2">Local</th>
                  <th className="px-4 py-2">Período</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {viagens.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-2">{v.evento}</td>
                    <td className="px-4 py-2">{v.nome}</td>
                    <td className="px-4 py-2">{v.local}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{v.dataInicio} a {v.dataFim}</td>
                    <td className="px-4 py-2 text-right">
                      {canEdit && <DeleteButton action={deleteViagem} id={v.id} />}
                    </td>
                  </tr>
                ))}
                {viagens.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                      Nenhuma viagem cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
