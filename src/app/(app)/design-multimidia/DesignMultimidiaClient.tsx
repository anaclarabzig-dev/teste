"use client";

import { useState } from "react";
import { createDesign, deleteDesign, createMultimedia, deleteMultimedia } from "./actions";

type Design = {
  id: string; demandante: string | null; executor: string | null; demanda: string | null;
  descricao: string | null; quantidade: number; dataInicio: string | null; dataEntrega: string | null;
  usoIA: string | null; linkAcesso: string | null;
};
type Multimedia = {
  id: string; demandante: string | null; executor: string | null; demanda: string | null;
  formato: string | null; fotos: number; audioTime: string | null; videoTime: string | null;
  upload: string | null; dataSolicitacao: string | null; dataEntrega: string | null;
};

const TABS = ["Design", "Multimídia"] as const;
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

export default function DesignMultimidiaClient({
  design, multimedia, canEdit,
}: { design: Design[]; multimedia: Multimedia[]; canEdit: boolean }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Design");

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

      {tab === "Design" && (
        <div className="space-y-4">
          {canEdit && (
            <form action={createDesign} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-4">
              <input name="demandante" placeholder="Demandante" className={inputClass} />
              <input name="executor" placeholder="Executor" className={inputClass} />
              <input name="demanda" placeholder="Demanda (ex: Thumbnail)" required className={inputClass} />
              <input name="quantidade" type="number" min={0} placeholder="Quantidade" className={inputClass} />
              <input name="dataInicio" type="date" className={inputClass} />
              <input name="dataEntrega" type="date" className={inputClass} />
              <select name="usoIA" className={inputClass} defaultValue="">
                <option value="">Uso de IA?</option>
                <option value="SIM">SIM</option>
                <option value="NÃO">NÃO</option>
              </select>
              <input name="linkAcesso" placeholder="Link de acesso" className={inputClass} />
              <textarea name="descricao" placeholder="Descrição" rows={1} className={`col-span-2 ${inputClass} sm:col-span-4`} />
              <button type="submit" className={`${btnClass} col-span-2 sm:col-span-4`}>Adicionar</button>
            </form>
          )}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-2">Demanda</th><th className="px-4 py-2">Demandante</th><th className="px-4 py-2">Executor</th>
                  <th className="px-4 py-2">Qtd</th><th className="px-4 py-2">IA</th><th className="px-4 py-2">Entrega</th><th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {design.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-2">{d.demanda}{d.descricao && <p className="text-xs text-neutral-500">{d.descricao}</p>}</td>
                    <td className="px-4 py-2">{d.demandante}</td>
                    <td className="px-4 py-2">{d.executor}</td>
                    <td className="px-4 py-2">{d.quantidade}</td>
                    <td className="px-4 py-2">{d.usoIA}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{d.dataEntrega}</td>
                    <td className="px-4 py-2 text-right">{canEdit && <DelBtn action={deleteDesign} id={d.id} />}</td>
                  </tr>
                ))}
                {design.length === 0 && <tr><td colSpan={7} className="px-4 py-6 text-center text-neutral-400">Nenhuma atividade de design.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Multimídia" && (
        <div className="space-y-4">
          {canEdit && (
            <form action={createMultimedia} className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-4">
              <input name="demandante" placeholder="Demandante" className={inputClass} />
              <input name="executor" placeholder="Executor" className={inputClass} />
              <input name="demanda" placeholder="Demanda (ex: Foto)" required className={inputClass} />
              <input name="formato" placeholder="Formato / assunto" className={inputClass} />
              <input name="fotos" type="number" min={0} placeholder="Fotos" className={inputClass} />
              <input name="audioTime" placeholder="Tempo de áudio (hh:mm:ss)" className={inputClass} />
              <input name="videoTime" placeholder="Tempo de vídeo (hh:mm:ss)" className={inputClass} />
              <input name="upload" placeholder="Onde foi feito upload" className={inputClass} />
              <input name="dataSolicitacao" type="date" className={inputClass} />
              <input name="dataEntrega" type="date" className={inputClass} />
              <button type="submit" className={`${btnClass} col-span-2 sm:col-span-4`}>Adicionar</button>
            </form>
          )}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-2">Demanda</th><th className="px-4 py-2">Demandante</th><th className="px-4 py-2">Executor</th>
                  <th className="px-4 py-2">Fotos</th><th className="px-4 py-2">Áudio</th><th className="px-4 py-2">Vídeo</th>
                  <th className="px-4 py-2">Entrega</th><th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {multimedia.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2">{m.demanda}{m.formato && <p className="text-xs text-neutral-500">{m.formato}</p>}</td>
                    <td className="px-4 py-2">{m.demandante}</td>
                    <td className="px-4 py-2">{m.executor}</td>
                    <td className="px-4 py-2">{m.fotos}</td>
                    <td className="px-4 py-2">{m.audioTime}</td>
                    <td className="px-4 py-2">{m.videoTime}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{m.dataEntrega}</td>
                    <td className="px-4 py-2 text-right">{canEdit && <DelBtn action={deleteMultimedia} id={m.id} />}</td>
                  </tr>
                ))}
                {multimedia.length === 0 && <tr><td colSpan={8} className="px-4 py-6 text-center text-neutral-400">Nenhuma atividade de multimídia.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
